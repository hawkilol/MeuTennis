# Generated by Django 4.2.7 on 2023-11-19 03:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quickstart', '0006_alter_rankingitem_ranking'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rankingitem',
            name='Ranking',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rankings', to='quickstart.ranking'),
        ),
    ]
