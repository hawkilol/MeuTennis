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
    
class PersonReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = (
            'Updated',
            'TennisId',
            'StandardGivenName',
            'StandardFamilyName',
        )
        

class ChallengeSerializer(serializers.ModelSerializer):
    Challenger = serializers.PrimaryKeyRelatedField(queryset=RankingItem.objects.all())
    Challenged = serializers.PrimaryKeyRelatedField(queryset=RankingItem.objects.all())
    class Meta:
        model = Challenge
        fields = ['Challenger', 'Challenged']

class ChallengeStatusSerializer(serializers.ModelSerializer):
    Challenger = serializers.PrimaryKeyRelatedField(queryset=RankingItem.objects.all())
    Challenged = serializers.PrimaryKeyRelatedField(queryset=RankingItem.objects.all())
    class Meta:
        model = Challenge
        fields = ['Challenger', 'Challenged', 'Status']
    
# class ChallengeStatusUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Challenge
#         fields = ['Status']

#     def update_challenge_status(self, instance, validated_data):
#         print(validated_data.__dict__)
#         data = validated_data.pop('data')
#         print(data)
#         instance.Status = validated_data.pop('data')
#         instance.save()
#         return instance
class ChallengeStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['Status']
class RankingItemPersonSerializer(serializers.ModelSerializer):
    Person = PersonSerializer()
    Challenging = ChallengeSerializer(many=True, read_only=True, source='challenges_as_challenger')
    BeingChallenged = ChallengeSerializer(many=True, read_only=True, source='challenges_as_challenged')
    class Meta:
        model = RankingItem
        fields = '__all__'
            
class RankingItemNestedPersonSerializer(serializers.ModelSerializer):
    Person = PersonReadSerializer()
    class Meta:
        model = RankingItem
        fields = '__all__'
class RankingItemSerializer(serializers.ModelSerializer):
    Challenging = ChallengeSerializer(many=True, read_only=True, source='challenges_as_challenger')
    BeingChallenged = ChallengeSerializer(many=True, read_only=True, source='challenges_as_challenged')
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


class RankingPersonItemsSerializer(serializers.ModelSerializer):
    RankingItems = RankingItemPersonSerializer(many=True, read_only=True, source='rankings')
   
    class Meta:
        model = Ranking
        fields = '__all__'

class RankingItemOrderedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RankingItem
        fields = '__all__'



# class RankingPersonItemsSerializer(serializers.ModelSerializer):
#     RankingItems = RankingItemPersonSerializer(many=True, read_only=True, source='rankings')
#     class Meta:
#         model = Ranking
#         fields = '__all__'


# class RankingItemPersonSerializer(serializers.ModelSerializer):
#     Person = PersonSerializer()
#     Challenging = ChallengeSerializer(many=True, read_only=True, source='challenges_as_challenger')
#     BeingChallenged = ChallengeSerializer(many=True, read_only=True, source='challenges_as_challenged')
#     class Meta:
#         model = RankingItem
#         fields = '__all__'
            
class RankingPersonItemsOrderedSerializer(serializers.ModelSerializer):
    RankingItems = RankingItemPersonSerializer(many=True, read_only=True, source='ordered_ranking_items')

    class Meta:
        model = Ranking
        fields = '__all__'

# class RankingPersonItemsOrderedSerializer(serializers.ModelSerializer):
#     ordered_ranking_items = serializers.SerializerMethodField()

#     class Meta:
#         model = Ranking
#         fieldRankingPersonItemsOrderedSerializers = ['id', 'Updated', 'RankingID', 'Name', 'RankingType', 'Gender', 'ordered_ranking_items']

#     def get_ordered_ranking_items(self, obj):
#         # Order the RankingItems by the Result field
#         ranking_items = obj.rankings.all().order_by('-Result', 'Rank')
#         serializer = RankingItemSerializer(ranking_items, many=True)
#         return serializer.data


class ChallengeNestedSerializer(serializers.ModelSerializer):
    Challenger = RankingItemPersonSerializer(read_only=True)
    Challenged = RankingItemPersonSerializer(read_only=True)

    class Meta:
        model = Challenge
        fields = ['id', 'Challenger', 'Challenged', 'Status', 'Message']

class ChallengedNestedSerializer(serializers.ModelSerializer):
    Challenger = RankingItemNestedPersonSerializer(read_only=True)
    Challenged = RankingItemNestedPersonSerializer(read_only=True)

    class Meta:
        model = Challenge
        fields = ['Challenger', 'Challenged']




