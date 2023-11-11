from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from quickstart.serializers import UserSerializer, GroupSerializer
# from quickstart.serializers import UserSerializer, GroupSerializer, YourModelSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.http import JsonResponse

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

def get_version(request):
    return JsonResponse({'version': '1.0', 'framework': 'Django1'})

class TestList(viewsets.ViewSet):
    def list(self, request):
        return JsonResponse({'test': 'Pagman'})
class YourModelListView(viewsets.ViewSet):
    # @action(detail=False, methods=['get'])
    # def list(self, request):
    #     return JsonResponse({'version': '1.0', 'framework': 'Django'})

    @action(detail=False, methods=['get'])
    def get_version(self, request):
        return JsonResponse({'version': '1.0', 'framework': 'Django'})

# class YourModelListView(APIView):
#     def get_version(self, request, format=None):
#         return JsonResponse({'version': '1.0', 'framework': 'Django'})

#     # def get(self, request, format=None):
#     #     queryset = YourModel.objects.all()  # Replace with your actual queryset
#     #     serializer = YourModelSerializer(queryset, many=True)
#     #     return Response(serializer.data, status=status.HTTP_200_OK)