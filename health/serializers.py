import datetime

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *
import re
from django.db.models import Q


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['user_id'] = user.id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user_id'] = self.user.id

        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = ('user', 'date_of_birth', 'gender', 'identify_number', 'phone_number', 'description', 'is_approved')


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Doctor
        fields = ('user', 'identify_number', 'gender', 'phone_number', 'department', 'description', 'extra_information')


class PatientRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')
    password = serializers.CharField(write_only=True, source='user.password')
    firstName = serializers.CharField(max_length=100, source='user.first_name')
    lastName = serializers.CharField(max_length=100, source='user.last_name')
    phoneNumber = serializers.CharField(max_length=20, source='phone_number')
    birthDay = serializers.IntegerField(write_only=True)
    birthMonth = serializers.IntegerField(write_only=True)
    birthYear = serializers.IntegerField(write_only=True)
    gender = serializers.CharField(max_length=50)
    identityNumber = serializers.CharField(max_length=20, source='identify_number')

    class Meta:
        model = Patient
        fields = (
            'email', 'password', 'firstName', 'lastName', 'phoneNumber', 'birthDay', 'birthMonth', 'birthYear',
            'gender',
            'identityNumber')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Please check your mobile phone number format", "unique")
        return value

    def validate_phoneNumber(self, value):
        if not re.match(r'^\d{4,20}$', value):
            raise serializers.ValidationError("Please check your mobile phone number format")
        return value

    def validate_identityNumber(self, value):
        # 检查是否同时包含字母和数字
        if not re.match(r'^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$', value):
            raise serializers.ValidationError("Please check your identify number format")
        return value

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        dob = datetime.datetime(year=int(validated_data.pop('birthYear')),
                                month=int(validated_data.pop('birthMonth')),
                                day=int(validated_data.pop('birthDay'))).date()
        user = User.objects.create_user(
            username=user_data['email'],
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name']
        )
        patient = Patient.objects.create(
            user=user,
            date_of_birth=dob,
            gender=validated_data['gender'],
            identify_number=validated_data['identify_number'],
            phone_number=validated_data['phone_number'],
        )
        return patient


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = User.objects.filter(email=data['email']).first()
        if not user:
            raise serializers.ValidationError('Email does not exist')

        # 如果用户是Patient且未获批准，返回邮箱不存在的错误
        if hasattr(user, 'patient') and not user.patient.is_approved:
            raise serializers.ValidationError('Email does not exist')

        if not authenticate(username=user.username, password=data['password']):
            raise serializers.ValidationError('Password is incorrect')

        # 生成JWT令牌
        refresh = RefreshToken.for_user(user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user'] = user
        return data


class PatientApprovalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id')
    email = serializers.EmailField(source='user.email')
    lastName = serializers.CharField(source='user.last_name')
    firstName = serializers.CharField(source='user.first_name')
    identity = serializers.CharField(source='identify_number', allow_null=True)

    class Meta:
        model = Patient
        fields = ['id', 'identity', 'email', 'lastName', 'firstName', 'phone_number']


class DoctorRegistrationSerializer(serializers.ModelSerializer):
    identityNumber = serializers.CharField(source='identify_number', max_length=20)
    email = serializers.EmailField(source='user.email')
    password = serializers.CharField(write_only=True, source='user.password')
    firstName = serializers.CharField(source='user.first_name', max_length=30)
    lastName = serializers.CharField(source='user.last_name', max_length=150)
    phoneNumber = serializers.CharField(max_length=20, allow_blank=True)  # 使用username字段存储电话号码
    gender = serializers.CharField(max_length=50)
    selectedDepartment = serializers.CharField(source='department', max_length=50)
    description = serializers.CharField(allow_blank=True, required=False)
    extraInformation = serializers.CharField(allow_blank=True, required=False, source='extra_information')

    class Meta:
        model = Doctor
        fields = ['identityNumber', 'email', 'password', 'firstName', 'lastName',
                  'phoneNumber', 'gender', 'selectedDepartment', 'description', 'extraInformation']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_identityNumber(self, value):
        if not re.match(r'^[a-zA-Z0-9]+$', value):
            raise serializers.ValidationError("Identity number format is invalid. It must be alphanumeric.")
        return value

    def validate_phoneNumber(self, value):
        if not re.match(r'^\d+$', value):
            raise serializers.ValidationError("Phone number format is invalid. It must be numeric.")
        return value

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        # 创建User实例
        user = User.objects.create_user(
            username=user_data['email'],  # 使用email作为username
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', '')
        )
        # 创建Doctor实例，确保将所有字段从validated_data传递
        doctor = Doctor.objects.create(
            user=user,
            identify_number=validated_data.get('identify_number', ''),
            phone_number=validated_data.get('phone_number', ''),
            gender=validated_data.get('gender', 'undefined'),
            department=validated_data.get('department', 'unallocated'),
            description=validated_data.get('description', ''),
            extra_information=validated_data.get('extra_information', '')
        )
        return doctor


class ScheduleTimeSerializer(serializers.Serializer):
    date = serializers.CharField()  # 接受任何格式的字符串
    times = serializers.ListField(child=serializers.TimeField(format="%H:%M"))

    def validate_date(self, value):
        # 尝试将字符串从MM/DD/YYYY转换为datetime.date对象
        try:
            date_obj = datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError("Date has wrong format. Use MM/DD/YYYY.")

        return date_obj


class DoctorScheduleSerializer(serializers.Serializer):
    selectedTimes = ScheduleTimeSerializer(many=True)

    def create(self, validated_data):
        doctor_id = self.context['doctor_id']  # 从视图传递医生ID
        selected_times = validated_data['selectedTimes']

        # 准备好要创建的schedules列表
        schedules_to_create = []
        for item in selected_times:
            date = item['date']
            times = item['times']
            for time in times:
                # 检查数据库中是否已存在相同的排班记录
                exists = Schedule.objects.filter(
                    Q(doctor_id=doctor_id) & Q(date=date) & Q(time=time)
                ).exists()
                # 如果不存在，则添加到schedules_to_create列表中
                if not exists:
                    schedule = Schedule(doctor_id=doctor_id, date=date, time=time)
                    schedules_to_create.append(schedule)

        # 使用bulk_create来批量创建排班记录，这里会忽略已存在的记录
        Schedule.objects.bulk_create(schedules_to_create)

        # 返回创建的schedules，注意这里不包括因重复被忽略的记录
        return schedules_to_create


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['date', 'time']


class AvailableTimeSerializer(serializers.Serializer):
    date = serializers.DateField()
    time = serializers.TimeField()


class AppointmentSerializer(serializers.ModelSerializer):
    department = serializers.CharField(write_only=True)  # 作为输入用，不输出
    date = serializers.DateField()
    time = serializers.TimeField(format='%H:%M')
    description = serializers.CharField()

    class Meta:
        model = Appointment
        fields = ['department', 'date', 'time', 'description']

    def validate(self, attrs):
        # 根据部门、日期和时间查找排班
        department = attrs.pop('department', None)
        date = attrs.get('date')
        time = attrs.get('time')

        if department:
            schedule = Schedule.objects.filter(doctor__doctor__department=department, date=date, time=time,
                                               is_booked=False).first()
            if not schedule:
                raise serializers.ValidationError(
                    "No available slot found for the selected department, date, and time.")
            attrs['schedule'] = schedule
        else:
            raise serializers.ValidationError("Department must be specified.")
        return attrs


class DoctorAppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    advice = serializers.CharField(source='doctor_advice', read_only=True)  # 添加对医生建议的引用

    class Meta:
        model = Appointment
        fields = ['appointment_number', 'patient_name', 'time', 'description', 'status', 'location', 'advice']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_time(self, obj):
        return obj.schedule.date.strftime('%Y-%m-%d') + ' ' + obj.schedule.time.strftime('%H:%M')


class PatientAppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    advice = serializers.CharField(source='doctor_advice', read_only=True)

    class Meta:
        model = Appointment
        fields = ['appointment_number', 'doctor_name', 'time', 'description', 'status', 'location', 'advice']

    def get_doctor_name(self, obj):
        # Assumes that 'doctor' is accessible through the 'schedule' relationship
        return f"{obj.schedule.doctor.first_name} {obj.schedule.doctor.last_name}"

    def get_time(self, obj):
        # Format the datetime field to show only date and time
        return obj.schedule.date.strftime('%Y-%m-%d') + ' ' + obj.schedule.time.strftime('%H:%M')


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['medicine_name', 'quantity', 'usage_description']


class ExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        fields = ['exam_name', 'exam_date', 'exam_description', 'exam_result']


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['medicine_name', 'quantity', 'usage_description']


class ExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        fields = ['exam_name', 'exam_date', 'exam_description']


class MedicalRecordSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True)
    examinations = ExaminationSerializer(many=True)

    class Meta:
        model = MedicalRecord
        fields = ['condition_description', 'diagnosis_description', 'prescriptions', 'examinations']

    def update(self, instance, validated_data):
        # 删除旧的处方和检查记录
        instance.prescriptions.all().delete()
        instance.examinations.all().delete()

        # 更新就诊记录的基本信息
        instance.condition_description = validated_data.get('condition_description')
        instance.diagnosis_description = validated_data.get('diagnosis_description')
        instance.save()

        # 处理处方数据
        prescriptions_data = validated_data.get('prescriptions', [])
        for prescription_data in prescriptions_data:
            Prescription.objects.create(medical_record=instance, **prescription_data)

        # 处理检查数据
        examinations_data = validated_data.get('examinations', [])
        for examination_data in examinations_data:
            Examination.objects.create(medical_record=instance, **examination_data)

        return instance


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['appointment_number', 'status', 'doctor_advice']

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.doctor_advice = validated_data.get('doctor_advice', instance.doctor_advice)
        instance.save()
        return instance


class MessageSerializer(serializers.ModelSerializer):
    sender_type = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'text', 'sender', 'sender_type', 'created_at']

    def get_sender_type(self, obj):
        # 判断消息发送者是否为对话中的患者
        if obj.sender == obj.conversation.patient:
            return 'Patient'
        else:
            return 'Admin'


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['conversation_id', 'patient', 'messages', 'created_at']
