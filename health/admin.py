from django.contrib import admin
from .models import Patient, Doctor, Admin


# Optional: Customize how models are displayed in the Django admin
class PatientAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Patient._meta.fields]


class DoctorAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Doctor._meta.fields]


class AdminAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Admin._meta.fields]


# Register your models here
admin.site.register(Patient, PatientAdmin)
admin.site.register(Doctor, DoctorAdmin)
admin.site.register(Admin, AdminAdmin)

