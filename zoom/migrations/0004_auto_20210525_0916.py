# Generated by Django 3.1.2 on 2021-05-25 09:16

from django.db import migrations, models
import django_cryptography.fields

def purge_data(apps, schema_editor):
    ZoomUserToken = apps.get_model("zoom", "ZoomUserToken")
    ZoomUserToken.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('zoom', '0003_zoomusertoken_zoom_api_data'),
    ]

    operations = [
        migrations.RunPython(purge_data),
        migrations.AlterField(
            model_name='zoomusertoken',
            name='access_token',
            field=django_cryptography.fields.encrypt(models.CharField(max_length=1024)),
        ),
        migrations.AlterField(
            model_name='zoomusertoken',
            name='refresh_token',
            field=django_cryptography.fields.encrypt(models.CharField(max_length=1024)),
        ),
        migrations.AlterField(
            model_name='zoomusertoken',
            name='zoom_api_data',
            field=django_cryptography.fields.encrypt(models.TextField(default='{}')),
        ),
    ]
