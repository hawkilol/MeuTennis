"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path
# from quickstart import views

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]

from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from quickstart import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet) 
# router.register(r'version', views.YourModelListView, basename='version')
# router.register(r'test', views.TestList, basename='test L')
# router.register(r'rankings', views.RankingListCreateView, basename='ranking-list')
router.register(r'rankings', views.RankingViewSet, basename='add-to-ranking')
router.register(r'ranking', views.RankingPersonInsideViewSet, basename='ranking-nested')
router.register(r'challenges', views.ChallengeViewSet, basename='challenge-id')
router.register(r'challenge', views.ChallengeNestedViewSet, basename='challenge-nested')
router.register(r'rankingItem', views.RankingItemViewSet, basename='challenge-nested')

# /rankings/1/add_ranking_item/
router.register(r'rankings/<int:pk>', views.RankingRetrieveUpdateDestroyView, basename='ranking-detail')
router.register(r'ranking-items', views.RankingItemCreateView, basename='ranking-item-create')
router.register(r'ranking-items/<int:pk>', views.RankingItemRetrieveUpdateDestroyView, basename='ranking-item-detail')
router.register(r'person', views.PersonListCreateView, basename='person-list')
router.register(r'persons/<int:pk>', views.PersonRetrieveUpdateDestroyView, basename='person-detail')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('login', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),

]