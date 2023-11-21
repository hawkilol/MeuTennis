# Generated by Django 4.2.7 on 2023-11-19 02:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0004_ranking_rankingitems'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ranking',
            name='RankingItems',
        ),
        migrations.AddField(
            model_name='ranking',
            name='RankingItems',
            field=models.ManyToManyField(blank=True, related_name='rankings', to='quickstart.rankingitem'),
        ),
    ]
