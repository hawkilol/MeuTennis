from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from django.shortcuts import get_object_or_404
from django.db.models import F
from django.views.decorators.csrf import csrf_exempt
from quickstart.serializers import UserSerializer, GroupSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login
from django.http import Http404, JsonResponse, HttpResponse
from django.urls import get_resolver

from django.http import JsonResponse
from quickstart.models import Ranking, RankingItem, Person, Challenge
from quickstart.serializers import ChallengeStatusUpdateSerializer, RankingSerializer, RankingItemSerializer, PersonSerializer, RankingItemPersonSerializer, RankingPersonItemsSerializer, ChallengeSerializer, ChallengeNestedSerializer, ChallengedNestedSerializer, RankingPersonItemsOrderedSerializer
from rest_framework_simplejwt.tokens import RefreshToken, Token, UntypedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication
import socket
import asyncio
import json
from asgiref.sync import sync_to_async  # Import sync_to_async
from channels.layers import get_channel_layer
from django.contrib.auth.models import AnonymousUser

import websockets
from threading import Thread
from django.db.models.signals import post_save
from django.dispatch import receiver

connected_clients = set()
connected_clients_dict = {}

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer 

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer  

class RankingPersonInsideViewSet(viewsets.ModelViewSet):
    queryset = Ranking.objects.prefetch_related('rankings').all()
    serializer_class = RankingPersonItemsSerializer
    
@sync_to_async  
def getRanking(arguments):
    try:
        args_list = arguments.split()
        ranking_id = int(args_list[0])
        ranking = Ranking.objects.prefetch_related('rankings').get(id=ranking_id)
        
        ordered_ranking_items =  ranking.rankings.all().order_by('-Result', 'Rank')

        ranking.ordered_ranking_items = ordered_ranking_items

        serializer = RankingPersonItemsOrderedSerializer(ranking)
        data = serializer.data

        return data
    except Ranking.DoesNotExist:
        raise Exception(f"Ranking with ID {ranking_id} does not exist.")
    except Exception as e:
        raise Exception(str(e))


    

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
        
        person_serializer = PersonSerializer(data=request.data.get('Person'))
        if person_serializer.is_valid():
            person = person_serializer.save()
        else:
            return Response(person_serializer.errors, status=400)
        try:
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
                asyncio.run(broadcast_ranking_update()) 
                return Response(ranking_item_serializer.data)
            else:
                # Deleta a pessoa caso ocorra um erro
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

@authentication_classes([TokenAuthentication, JWTAuthentication])
@permission_classes([IsAuthenticated])
class ChallengeNestedViewSet(viewsets.ModelViewSet):
    
    queryset =  Challenge.objects.prefetch_related('challenges_as_challenger', 'challenges_as_challenged').all()
    serializer_class = ChallengeNestedSerializer

def list(self, request):
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
        serializer = ChallengedNestedSerializer(challengers, many=True)

        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def register_challenge(self, request):
        try:
            print(request)
            print(request.data)
            print(request.user)
            ranking_item = RankingItem.objects.get(Person__user=request.user)

            print(request.data.get('Challenged'))
            challenge_data = {
                'Challenger':  ranking_item.id,
                'Challenged': request.data.get('Challenged'),
            }

            serializer = ChallengeSerializer(data=challenge_data)
            if serializer.is_valid():
                serializer.save()
                # difunde atualiza os desafios do desafiado
                asyncio.run(broadcast_challenge_to_user(request.data.get('Challenged_user_id')))
                # asyncio.run(broadcast_data_to_user(data, request.user.id))
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except RankingItem.DoesNotExist:
            raise Http404("RankingItem for the current user does not exist.")
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_challenging(request):
    print("request")
    print(request.__dict__)
    user_ranking_items = RankingItem.objects.get(Person__user=request.user)
    print("user_ranking_intems")
    Challenges = Challenge.objects.filter(Challenger=user_ranking_items)
    
    serializer = ChallengeNestedSerializer(Challenges, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_challenges(request):
    user_ranking_items = RankingItem.objects.get(Person__user=request.user)
    Challenges = Challenge.objects.filter(Challenged=user_ranking_items)
    
    serializer = ChallengeNestedSerializer(Challenges, many=True)
    return Response(serializer.data)


@sync_to_async  
def changeChallengeStatus(challenge_id, status):
    try:
        print(challenge_id, status)
    
        challenge = get_object_or_404(Challenge, id=challenge_id)
        data = {
            'Status': status  # Use 'Status' instead of 'status' to match the serializer field
        }
        
        serializer = ChallengeStatusUpdateSerializer(challenge, data=data)
        
        if serializer.is_valid():
            serializer.save()
            return "OK"
        else:
            print(serializer.errors)
    except Challenge.DoesNotExist:
        print("Challenge not found.")



@sync_to_async
def get_user_from_token_async(token_string):
    try:
        token = UntypedToken(token_string)
        user_id = token.payload["user_id"]
        user = User.objects.get(pk=user_id)
        return user
    except Exception as e:
        print(f"Error decoding token: {e}")
        return AnonymousUser()
    

# @sync_to_async
def get_user_from_token(token_string):
    try:
        token = UntypedToken(token_string)
        user_id = token.payload["user_id"]
        user = User.objects.get(pk=user_id)
        return user
    except Exception as e:
        print(f"Error decoding token: {e}")
        return AnonymousUser()
    



    
@sync_to_async  
def getChallenging(token):
    user = get_user_from_token(token)
    user_ranking_items = RankingItem.objects.get(Person__user=user)
    Challenges = Challenge.objects.filter(Challenger=user_ranking_items)
    
    serializer = ChallengeNestedSerializer(Challenges, many=True)
    return serializer.data

@sync_to_async  
def getChallenges(token):
    user = get_user_from_token(token)
    user_ranking_items = RankingItem.objects.get(Person__user=user)
    Challenges = Challenge.objects.filter(Challenged=user_ranking_items)
    serializer = ChallengeNestedSerializer(Challenges, many=True)
    return serializer.data

@sync_to_async  
def getChallengesFromUser(user):
    user_ranking_items = RankingItem.objects.get(Person__user=user)
    Challenges = Challenge.objects.filter(Challenged=user_ranking_items)
    serializer = ChallengeNestedSerializer(Challenges, many=True)
    return serializer.data

#broken
@sync_to_async  
def getChallengesFromId(user_id):
    user_ranking_items = RankingItem.objects.get(Person__user=user_id)
    Challenges = Challenge.objects.filter(Challenged=user_ranking_items)
    serializer = ChallengeNestedSerializer(Challenges, many=True)
    return serializer.data

@sync_to_async  
def makeChallenge(challenged_rankingItem_id, challenged_user_id, usr_token):
        user = get_user_from_token(usr_token)

        try:
            ranking_item = RankingItem.objects.get(Person__user=user)

            challenge_data = {
                'Challenger':  ranking_item.id,
                'Challenged': challenged_rankingItem_id,
            }

            serializer = ChallengeSerializer(data=challenge_data)
            if serializer.is_valid():
                serializer.save()
                # difunde atualiza os desafios do desafiado
                # sem asyncio já que vai causar deadlock em single-thread
                start_thread_broadcast(challenged_user_id)

                return serializer.data
            return serializer.errors
        except RankingItem.DoesNotExist:
            return "RankingItem for the current user does not exist."
        except Exception as e:
            return {"error": str(e)}




# async def broadcast_challenge_to_user(challenged_user_id):
#     # Your coroutine logic goes here
#     print(f"Broadcasting challenge to user {challenged_user_id}")

def start_thread_broadcast(challenged_user_id):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    async def run_coroutine_in_thread():
        await broadcast_challenge_to_user(challenged_user_id)

    thread = Thread(target=lambda: asyncio.run(run_coroutine_in_thread()), daemon=True)
    thread.start()

COMMANDS = {
    "getRanking": getRanking,
    "changeChallengeStatus": changeChallengeStatus,
    "getChallenging": getChallenging,
    "getChallenges": getChallenges,
    "makeChallenge": makeChallenge
}

async def handler(websocket, path):
    user_id = path[1:]
    print("userid connection from path: ", user_id)
    if(user_id): connected_clients_dict[user_id] = websocket

    connected_clients.add(websocket)
    
    try:
        while True:
            message = await websocket.recv()
            print(f"Received message from client: {message}")
            await process_message(websocket, message)

    except websockets.ConnectionClosedOK:
        print("Client closed connection")
    finally:
        if(user_id) in connected_clients_dict: del connected_clients_dict[user_id]
        connected_clients.remove(websocket)

async def sock(HOST, PORT):
    async with websockets.serve(handler, HOST, PORT):
        await asyncio.Future()  # Roda pra sempre

# ! SRPC ! (Semi-Remote-Procedure-Call))
async def process_message(websocket, message):
    # Parse
    command, *args = message.split()

    func = COMMANDS.get(command)

    if func:
        result = await func(*args)
        result = json.dumps(result)

        await websocket.send(result)
        print(f"Sent response to client: {result}")
    else:
        await websocket.send("Unknown command")

async def broadcast_ranking_update():
    # Get ranking atualizado (ranking global == 4) 
    updated_ranking_data = await getRanking('4')

    for client in connected_clients:
        try:
            await client.send(json.dumps(updated_ranking_data))
            print(f"Broadcasted ranking update to client: {client}")
        except websockets.ConnectionClosedOK:
            print(f"Failed to broadcast to closed connection: {client}")

# asyncio.run(broadcast_challenge(user_id, data))

async def broadcast_challenge_to_user(challenged_user_id):

    print("broadcast challenge")
    challenges  = await getChallengesFromUser(challenged_user_id)
    await broadcast_data_to_user(challenges, challenged_user_id)

async def broadcast_data_to_user(data, user_id):
    websocket = connected_clients_dict.get(str(user_id))
    if websocket:
        message = json.dumps(data)
        await websocket.send(message)
        print(f"Broadcasted update to user {user_id}")
    else:
        print(f"Error to broadcast to {user_id}, user probably disconnected")

@api_view(['GET'])
def make_server_socket(request):
    HOST = '127.0.0.1'     
    PORT = 50012
    print("Running socket on {}:{}".format(HOST, PORT))
    asyncio.run(sock(HOST, PORT))

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



# @api_view(['GET'])

# def make_server_socket(request):
#     HOST = '127.0.0.1'           
#     PORT = 50010
#     print("Server is running on {}:{}".format(HOST, PORT))             
#     with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#         s.bind((HOST, PORT))
#         s.listen(1)
#         conn, addr = s.accept()
#         with conn:
#             print('Connected by', addr)
#             while True:
#                 data = conn.recv(1024)
#                 print(data)
#                 if not data: break
#                 conn.sendall(data)
#     return Response("oi",status=status.HTTP_200_OK)
