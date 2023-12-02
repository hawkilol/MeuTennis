from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes

from django.views.decorators.csrf import csrf_exempt

from quickstart.serializers import UserSerializer, GroupSerializer
# from quickstart.serializers import UserSerializer, GroupSerializer, YourModelSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login
from django.http import Http404, JsonResponse, HttpResponse
from django.urls import get_resolver


from django.http import JsonResponse
from quickstart.models import Ranking, RankingItem, Person, Challenge
from quickstart.serializers import RankingSerializer, RankingItemSerializer, PersonSerializer, RankingItemPersonSerializer, RankingPersonItemsSerializer, ChallengeSerializer, ChallengeNestedSerializer, ChallengedNestedSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication
import socket
import asyncio
# import websockets
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer 

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer  # Replace with your actual Group serializer

# class YourModelListView(viewsets.ModelViewSet):
#     queryset = YourModel.objects.all()
#     serializer_class = YourModelSerializer  # Replace with your actual Model serializer
# class TestList(viewsets.ModelViewSet):
#     queryset = Test.objects.all()
#     serializer_class = TestSerializer  # Replace with your actual Test serializer

class RankingPersonInsideViewSet(viewsets.ModelViewSet):
    queryset = Ranking.objects.prefetch_related('rankings').all()
    serializer_class = RankingPersonItemsSerializer

class RankingViewSet(viewsets.ModelViewSet):
    queryset = Ranking.objects.prefetch_related('rankings').all()
    print(queryset)
    serializer_class = RankingSerializer
    def get_queryset(self):
        return Ranking.objects.prefetch_related('rankings').all()

    @action(detail=True, methods=['post'])
    def add_person_to_ranking(self, request, pk=None):
        print(request.data)
        ranking = self.get_object()
        
        person_id = request.data.get('person_id')
        try:
            person = Person.objects.get(pk=person_id)
            print(person.__dict__)
        except Person.DoesNotExist:
            return Response({"error": f"Person with ID {person_id} does not exist."}, status=400)

        ranking_item_data = {
            'Type': request.data.get('Type'),
            'SortOrder': request.data.get('SortOrder'),
            'Result': request.data.get('Result'),
            'Rank': request.data.get('Rank'),
            'RankingItemsCode': request.data.get('RankingItemsCode'),
            'Person': person.id,
            'Ranking': ranking.id,
        }

        ranking_item_serializer = RankingItemSerializer(data=ranking_item_data)
        if ranking_item_serializer.is_valid():
            ranking_item_serializer.save()
            return Response(ranking_item_serializer.data, status=status.HTTP_202_ACCEPTED
)
        else:
            return Response(ranking_item_serializer.errors, status=400)
        

    @action(detail=True, methods=['post'])
    def add_ranking_item(self, request, pk=None):
        ranking = self.get_object()
        serializer = RankingItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ranking=ranking)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['post'])
    def add_create_person_to_ranking(self, request, pk=None):
        ranking = self.get_object()
        
        # Create a new Person
        person_serializer = PersonSerializer(data=request.data.get('Person'))
        if person_serializer.is_valid():
            person = person_serializer.save()
        else:
            return Response(person_serializer.errors, status=400)
        try:
        # Create a new RankingItem with the created Person
            ranking_item_data = {
                'Type': request.data.get('Type'),
                'SortOrder': request.data.get('SortOrder'),
                'Result': request.data.get('Result'),
                'Rank': request.data.get('Rank'),
                'RankingItemsCode': request.data.get('RankingItemsCode'),
                'Person': person.id,
                'Ranking': ranking.id,
            }
        
            ranking_item_serializer = RankingItemSerializer(data=ranking_item_data)
            if ranking_item_serializer.is_valid():
                ranking_item_serializer.save()
                return Response(ranking_item_serializer.data)
            else:
                # If there's an error, delete the created Person
                person.delete()
                return Response(ranking_item_serializer.errors, status=400)
        
        except Exception as e:
            person.delete()
            return Response({"error": str(e)}, status=500)

@authentication_classes([TokenAuthentication, JWTAuthentication])
@permission_classes([IsAuthenticated])
class ChallengeViewSet(viewsets.ModelViewSet):
    queryset =  Challenge.objects.prefetch_related('challenges_as_challenger', 'challenges_as_challenged').all()
    serializer_class = ChallengeSerializer


# user_ranking_items = RankingItem.objects.get(Person__user=request.user)
#     print("user_ranking_items")
#     Challenges = Challenge.objects.filter(Challenger=user_ranking_items)
#     print("request")
#     print(request)
#     # Challenges = Challenge.objects.filter(Challenger__person__user=user)
#     serializer = ChallengeNestedSerializer(Challenges, many=True)
#     return Response(serializer.data)
@authentication_classes([TokenAuthentication, JWTAuthentication])
@permission_classes([IsAuthenticated])
class ChallengeNestedViewSet(viewsets.ModelViewSet):
    
    queryset =  Challenge.objects.prefetch_related('challenges_as_challenger', 'challenges_as_challenged').all()
    serializer_class = ChallengeNestedSerializer

def list(self, request):
    # Use the prefetched ranking items in the serializer
    serializer = self.get_serializer(self.get_queryset(), many=True)
    print(serializer.data)
    return Response(serializer.data)

class RankingRetrieveUpdateDestroyView(viewsets.ModelViewSet):
    queryset = Ranking.objects.all()
    serializer_class = RankingSerializer



class RankingItemViewSet(viewsets.ModelViewSet):
    queryset = RankingItem.objects.all()
    serializer_class = RankingItemSerializer

    @action(detail=True, methods=['get'])
    def challenges(self, request, pk=None):
        ranking_item = self.get_object()
        challengers = ranking_item.challenges_as_challenged.all()
        print("challengers")
        print(challengers)
        # serializer = ChallengeNestedSerializer(challengers, many=True)
        serializer = ChallengedNestedSerializer(challengers, many=True)

        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def register_challenge(self, request):
        try:
            # Get the RankingItem associated with the current user
            print(request)
            print(request.data)
            print(request.user)
            ranking_item = RankingItem.objects.get(Person__user=request.user)


            print(request.data.get('Challenged'))
            # Create a new challenge
            challenge_data = {
                'Challenger':  ranking_item.id,
                'Challenged': request.data.get('Challenged'),  # Assuming you send the ID of the challenged RankingItem in the request
                # You may need to adjust the data based on your actual model structure
            }

            serializer = ChallengeSerializer(data=challenge_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except RankingItem.DoesNotExist:
            raise Http404("RankingItem for the current user does not exist.")
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    
# quickstart/views.py


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def current_user_challenges(request):
#     # user = request.user
#     user_ranking_items = RankingItem.objects.get(Person__user=request.user)
#     print("user_ranking_items")
#     Challenges = Challenge.objects.filter(Challenger=user_ranking_items)
#     print("request")
#     print(request)
#     # Challenges = Challenge.objects.filter(Challenger__person__user=user)
#     serializer = ChallengeNestedSerializer(Challenges, many=True)
#     return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_challenging(request):
    # user = request.user
    print("request")
    print(request.__dict__)
    user_ranking_items = RankingItem.objects.get(Person__user=request.user)
    print("user_ranking_items")
    Challenges = Challenge.objects.filter(Challenger=user_ranking_items)
    
    # Challenges = Challenge.objects.filter(Challenger__person__user=user)
    serializer = ChallengeNestedSerializer(Challenges, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_challenges(request):
    # user = request.user
    print("request")
    print(request.__dict__)
    user_ranking_items = RankingItem.objects.get(Person__user=request.user)
    print("user_ranking_items")
    Challenges = Challenge.objects.filter(Challenged=user_ranking_items)
    
    # Challenges = Challenge.objects.filter(Challenger__person__user=user)
    serializer = ChallengeNestedSerializer(Challenges, many=True)
    return Response(serializer.data)


@api_view(['GET'])

def make_server_socket(request):
    HOST = '127.0.0.1'                 # Symbolic name meaning all available interfaces
    PORT = 50010
    print("Server is running on {}:{}".format(HOST, PORT))              # Arbitrary non-privileged port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen(1)
        conn, addr = s.accept()
        with conn:
            print('Connected by', addr)
            while True:
                data = conn.recv(1024)
                print(data)
                if not data: break
                conn.sendall(data)
    return Response("oi",status=status.HTTP_200_OK)

class RankingItemCreateView(viewsets.ModelViewSet):
    queryset = RankingItem.objects.all()
    serializer_class = RankingItemSerializer

class RankingItemRetrieveUpdateDestroyView(viewsets.ModelViewSet):
    queryset = RankingItem.objects.all()
    serializer_class = RankingItemSerializer
    
class PersonListCreateView(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

    def create(self, request):
        print(request.data)
        serializer = PersonSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        person = serializer.save()
        serialized_data = serializer.data
        serialized_data['person_id'] = person.id

        return Response(serialized_data, status=status.HTTP_201_CREATED)

class PersonRetrieveUpdateDestroyView(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


def show_routes(request):
    all_routes = get_resolver(None).reverse_dict.keys()
    response_content = '\n'.join(sorted(str(route) for route in all_routes))
    return HttpResponse(response_content, content_type='text/plain')

def generate_tokens(user):
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username
        refresh['email'] = user.email
        refresh['first_name'] = user.first_name
        refresh['last_name'] = user.last_name

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)

    if user:
        login(request, user)
        tokens = generate_tokens(user)
        return Response(tokens, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
