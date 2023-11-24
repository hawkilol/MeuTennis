from django.contrib.auth.models import User, Group

from quickstart.models import Ranking, RankingItem, Person, Challenge
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
    

class ChallengeSerializer(serializers.ModelSerializer):
    Challenger = serializers.PrimaryKeyRelatedField(queryset=RankingItem.objects.all())
    Challenged = serializers.PrimaryKeyRelatedField(queryset=RankingItem.objects.all())
    class Meta:
        model = Challenge
        fields = ['Challenger', 'Challenged']

class RankingItemPersonSerializer(serializers.ModelSerializer):
    Person = PersonSerializer()
    Challenging = ChallengeSerializer(many=True, read_only=True, source='challenges_as_challenger')
    BeingChallenged = ChallengeSerializer(many=True, read_only=True, source='challenges_as_challenged')
    class Meta:
        model = RankingItem
        fields = '__all__'
            

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
            
class RankingSerializer(serializers.ModelSerializer):
    RankingItems = RankingItemSerializer(many=True, read_only=True, source='rankings')
    class Meta:
        model = Ranking
        fields = '__all__'



class RankingPersonItemsSerializer(serializers.ModelSerializer):
    RankingItems = RankingItemPersonSerializer(many=True, read_only=True, source='rankings')
    class Meta:
        model = Ranking
        fields = '__all__'

class ChallengeNestedSerializer(serializers.ModelSerializer):
    Challenger = RankingItemPersonSerializer(read_only=True)
    Challenged = RankingItemPersonSerializer(read_only=True)
    class Meta:
        model = Challenge
        fields = ['Challenger', 'Challenged']




