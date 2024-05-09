from datetime import timezone, datetime

from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=50)
    identify_number = models.CharField(max_length=20, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    identify_number = models.CharField(max_length=20, blank=True, null=True)
    gender = models.CharField(max_length=50, default='undefined')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=50, default='unallocated')
    description = models.TextField(blank=True, null=True)
    extra_information = models.TextField(blank=True, null=True)


class Schedule(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedules')
    date = models.DateField()
    time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('doctor', 'date', 'time')  # 确保同一医生同一天同一时间只有一个排班


class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='schedule_appointments')
    appointment_number = models.CharField(max_length=100, blank=True, null=True)  # 预约编号字段
    doctor_advice = models.TextField(default='Please be patient and wait for the doctor\'s answer', blank=True, null=True)  # 医生建议
    description = models.TextField(blank=True, null=True)
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Pending Confirmation')
    location = models.CharField(max_length=50, default='Highfield')
    appointment_datetime = models.DateTimeField(blank=True, null=True)


    def __str__(self):
        return f"Appointment {self.appointment_number} for {self.patient.username} on {self.schedule.date} at {self.schedule.time}"


class MedicalRecord(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='medical_record')
    appointment_number = models.CharField(max_length=100, blank=True, null=True)  # 预约编号字段
    patient_name = models.CharField(max_length=100)
    condition_description = models.TextField(blank=True, null=True)
    diagnosis_description = models.TextField(default='Please be patient and wait for the doctor\'s answer', blank=True, null=True)

    def __str__(self):
        return f"Medical Record for {self.patient_name}"


class Prescription(models.Model):
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='prescriptions')
    medicine_name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    usage_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.medicine_name} for {self.medical_record.patient_name}"


class Examination(models.Model):
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='examinations')
    exam_name = models.CharField(max_length=100)
    exam_date = models.DateField()
    exam_description = models.TextField(blank=True, null=True)
    exam_result = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.exam_name} on {self.exam_date} for {self.medical_record.patient_name}"


class Conversation(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversation')
    conversation_id = models.CharField(max_length=100, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.conversation_id:
            # Generate a unique conversation ID when creating a new conversation
            self.conversation_id = f"chat{self.created_at.strftime('%Y%m%d')}{get_random_string(5)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Conversation {self.conversation_id} with {self.patient.username}"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    text = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"