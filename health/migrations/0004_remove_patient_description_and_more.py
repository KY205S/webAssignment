# Generated by Django 5.0.3 on 2024-03-28 14:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('health', '0003_appointment_booked_patients_patient_phone_number_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='description',
        ),
        migrations.RemoveField(
            model_name='patient',
            name='medical_history',
        ),
    ]
