from django.contrib.auth.models import User, Group

from quickstart.models import Ranking, RankingItem, Person

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']



class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['TennisId']

class RankingItemSerializer(serializers.ModelSerializer):
    Person = PersonSerializer()

    class Meta:
        model = RankingItem
        fields = ['Type', 'SortOrder', 'Result', 'Rank', 'RankingItemCode', 'Person']

class RankingSerializer(serializers.ModelSerializer):
    RankingItems = RankingItemSerializer(many=True)

    class Meta:
        model = Ranking
        fields = ['Updated', 'RankingID', 'Name', 'Discipline', 'RankingType', 'Gender', 'RankingItems']

# class YourModelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = YourModel
#         fields = '__all__'