# Generated by Django 4.2.7 on 2023-11-19 03:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0007_alter_rankingitem_ranking'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ranking',
            name='RankingItems',
        ),
    ]
