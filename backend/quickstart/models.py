from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Ranking(models.Model):
    Updated = models.DateField()
    RankingID = models.CharField(max_length=255)
    Name = models.CharField(max_length=128)
    RankingType = models.CharField(max_length=64)
    Gender = models.CharField(max_length=32)
    RankingItems = models.ManyToManyField('RankingItem', related_name='rankings', blank=True)

    def __str__(self):
        return self.Name
    

class RankingItem(models.Model):
    Type = models.CharField(max_length=32, default='Roll Over')
    SortOrder = models.IntegerField(default='1')
    Result = models.IntegerField(default='0')
    Rank = models.IntegerField(default='0')
    RankingItemsCode = models.IntegerField(default='0')
    Person = models.ForeignKey('Person', on_delete=models.CASCADE)
    Ranking = models.ForeignKey('Ranking', on_delete=models.CASCADE, related_name='rankings')
    Challenging = models.ManyToManyField('Challenge', related_name='challenges_as_challenger')
    BeingChallenged = models.ManyToManyField('Challenge', related_name='challenges_as_challenged')


class Person(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    Updated = models.DateField()
    TennisId = models.CharField(max_length=100)
    StandardGivenName = models.CharField(max_length=64)
    StandardFamilyName = models.CharField(max_length=64)

class Challenge(models.Model):
    Challenger =  models.ForeignKey('RankingItem', on_delete=models.CASCADE, related_name = 'challenges_as_challenger')
    Challenged =  models.ForeignKey('RankingItem', on_delete=models.CASCADE, related_name= 'challenges_as_challenged')


# python manage.py makemigrations
# python manage.py migrate

# your_app_name/admin.py
# from django.contrib import admin
# from .models import Book

# admin.site.register(Book)
