from django.contrib.auth.models import User, Group

from quickstart.models import Ranking, RankingItem, Person
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        # fields = (
        #     'url',
        #     'username',
        #     'password',
        #     'email'
        # )

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class RankingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RankingItem
        fields = '__all__'
    # def create(self, validated_data):
    #     print(validated_data)
    #     user_id = validated_data.pop('user_id')
    #     print(user_id)
    #     user_instance = User.objects.get('user_id')
    #     print(user_instance)
    #     person_instance = Person.objects.create(
    #         user=user_instance,
    #         **validated_data
    #     )
    #     return person_instance
        
class PersonSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Person
        fields = (
            'Updated',
            'TennisId',
            'StandardGivenName',
            'StandardFamilyName',
            'user'
        )
        
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        print(user_data)
        user_instance = User.objects.create_user(**user_data)
        person_instance = Person.objects.create(
            user=user_instance,
            **validated_data
        )
        return person_instance
class RankingSerializer(serializers.ModelSerializer):
    RankingItems = RankingItemSerializer(many=True, read_only=True, source='rankings')
    print(RankingItems)
    class Meta:
        model = Ranking
        fields = '__all__'