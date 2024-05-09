from django.core.mail import send_mail
from django.db import transaction
from django.shortcuts import get_object_or_404

from .permissions import IsAdminUser, IsAuthenticatedAndApprovedPatient, IsApprovedPatient, IsDoctor
from .serializers import *

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PatientRegistrationSerializer
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView
import datetime


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class PatientRegistration(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PatientRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "ok"}, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            custom_error_message = self.format_errors(errors)
            return Response({"message": custom_error_message}, status=status.HTTP_400_BAD_REQUEST)

    def format_errors(self, errors):
        print(errors)
        message = "Please check your input: \n"
        # 提取并拼接错误信息
        for field, messages in errors.items():
            if field == 'email':
                if 'unique' in str(messages):
                    message = message + "This email address has been registered\n"
                else:
                    message = message + "Please check your email format\n"
            if field == 'phoneNumber':
                message = message + "Please check your mobile phone number format\n"
            if field == 'identityNumber':
                message = message + "Please check your identify number format"
        # 如果没有匹配的自定义错误，返回一个通用错误信息
        return message


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            user = validated_data['user']
            response_data = {
                "message": "ok",
                "user_id": user.id,
                "access_token": validated_data['access'],
                "refresh_token": validated_data['refresh'],
                "role": "undefined"
            }
            if Patient.objects.filter(user=user).exists():
                response_data["role"] = "patient"
            elif Doctor.objects.filter(user=user).exists():
                response_data["role"] = "doctor"
            elif Admin.objects.filter(user=user).exists():
                response_data["role"] = "admin"
            return Response(response_data)
        else:
            # 直接从serializer.errors获取错误信息，并构建期望的格式
            error_message = next(iter(serializer.errors.values()))[0]
            return Response({"message": error_message}, status=400)


class DoctorRegistrationView(APIView):
    permission_classes = [IsAdminUser]  # 使用自定义的管理员检查

    def post(self, request, *args, **kwargs):
        serializer = DoctorRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "ok"}, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            custom_error_message = self.format_errors(errors)
            return Response({"message": custom_error_message}, status=status.HTTP_400_BAD_REQUEST)

    def format_errors(self, errors):
        message = "Please check your input: \n"
        # 提取并拼接错误信息
        for field, messages in errors.items():
            if field == 'email':
                if 'This email is already in use' in str(messages):
                    message = message + "This email address has been registered\n"
                elif 'Enter a valid email address' in str(messages):
                    message = message + "Please check your email format\n"
            if field == 'phoneNumber':
                message = message + "Please check your mobile phone number format\n"
            if field == 'identityNumber':
                message = message + "Please check your identify number format"
        # 如果没有匹配的自定义错误，返回一个通用错误信息
        return message


class PatientsApprovalView(APIView):
    permission_classes = [IsAdminUser]  # 使用自定义的管理员检查

    def get(self, request, *args, **kwargs):
        # 查询所有is_approved=False的Patient用户
        unapproved_patients = Patient.objects.filter(is_approved=False)
        serializer = PatientApprovalSerializer(unapproved_patients, many=True)
        return Response(serializer.data)


class ConfirmRegistrationView(APIView):
    permission_classes = [IsAdminUser]  # 使用自定义的管理员检查

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('id')
        approved = request.data.get('approved')

        try:
            patient = Patient.objects.get(user__id=user_id)
            if approved == 1:
                patient.is_approved = True
                email_subject = 'Registration Approved'
                email_message = 'Your registration has been approved.'
            else:
                email_subject = 'Registration Pending'
                email_message = 'Your registration is still pending approval.'

            patient.save()

            # 发送邮件
            send_mail(
                email_subject,
                email_message,
                'from@example.com',  # 替换为你的发送邮箱
                [patient.user.email],
                fail_silently=False,
            )

            return Response({"message": "Processed registration confirmation."})

        except Patient.DoesNotExist:
            return Response({"message": "User not found."}, status=404)


class ScheduleView(APIView):
    permission_classes = [IsDoctor]

    def post(self, request, *args, **kwargs):
        user = request.user
        # 确保当前用户是医生
        doctor_instance = get_object_or_404(Doctor, user=user)

        serializer = DoctorScheduleSerializer(data=request.data, context={'doctor_id': doctor_instance.user.id})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Schedules created successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 根据id获取医生的所有排班信息
# 这个是医生端的功能吗？
class DoctorSchedulesView(APIView):
    permission_classes = [IsDoctor]

    def get(self, request, *args, **kwargs):
        # 从JWT解码得到的当前登录的用户
        user = request.user
        # 根据当前用户（医生）查询排班信息
        schedules = Schedule.objects.filter(doctor=user).order_by('date', 'time')
        # 序列化排班信息
        serializer = ScheduleSerializer(schedules, many=True)
        # 返回序列化后的数据
        return Response(serializer.data)


# 患者可以通过选择部门，获取到当前该部门的所有当前时间以后的可预约时间
# 即使相同的时间有多个医生满足，都只显示一次，且无需返回doctor_id，只需要日期和时间
class AvailableTimesView(APIView):
    permission_classes = [IsApprovedPatient]  # 使用自定义的权限类

    def get(self, request, department):
        now = datetime.datetime.now()
        current_date = now.date()
        current_time = now.time()

        # 构建查询条件，获取指定部门未来的可预约时间，且这些时间未被预约
        query = (
                Q(doctor__doctor__department=department) &
                Q(is_booked=False) &  # 只考虑未被预约的排班
                (Q(date__gt=current_date) | Q(date=current_date, time__gt=current_time))
        )

        # 查询满足条件的排班，去重，并仅返回日期和时间
        schedules = Schedule.objects.filter(query).order_by('date', 'time').values('date', 'time').distinct()

        # 序列化排班信息
        serializer = AvailableTimeSerializer(schedules, many=True)

        # 返回序列化后的数据
        return Response(serializer.data)


class CreateAppointmentView(APIView):
    permission_classes = [IsApprovedPatient]

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            with transaction.atomic():
                schedule = serializer.validated_data['schedule']
                description = serializer.validated_data['description']
                date = serializer.validated_data['date']
                time = serializer.validated_data['time']

                # 创建预约
                appointment_datetime = datetime.datetime.combine(date, time)
                appointment = Appointment.objects.create(
                    patient=request.user,
                    schedule=schedule,
                    description=description,
                    status='Pending Confirmation',
                    appointment_datetime=appointment_datetime
                )
                # 更新排班为已预约
                schedule.is_booked = True
                schedule.save()

                # 生成预约编号
                appointment.appointment_number = f"APPT{schedule.date.strftime('%Y%m%d')}{appointment.id}"
                appointment.save()

                # 创建医疗记录
                MedicalRecord.objects.create(
                    appointment=appointment,
                    patient_name=request.user.get_full_name(),
                    condition_description=description,
                    appointment_number=appointment.appointment_number
                )

                return Response({"message": "Appointment successfully made.", "appointment_number": appointment.appointment_number}, status=201)
        return Response(serializer.errors, status=400)


class DoctorAppointmentsView(APIView):
    permission_classes = [IsDoctor]

    def get(self, request):
        user = request.user
        schedules = Schedule.objects.filter(doctor=user)
        appointments = Appointment.objects.filter(schedule__in=schedules).order_by('-schedule__date', '-schedule__time')
        serializer = DoctorAppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class PatientAppointmentsView(APIView):
    permission_classes = [IsApprovedPatient]

    def get(self, request):
        # 使用从JWT中获取的user_id找到患者的预约
        user = request.user
        appointments = Appointment.objects.filter(patient=user).order_by('-schedule__date', '-schedule__time')
        serializer = PatientAppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class MedicalRecordView(APIView):

    def get(self, request, appointment_number):
        medical_record = MedicalRecord.objects.filter(appointment__appointment_number=appointment_number).first()
        if not medical_record:
            return Response({"error": "Medical record not found"}, status=404)

        serializer = MedicalRecordSerializer(medical_record)
        doctor = medical_record.appointment.schedule.doctor  # 此处doctor是User对象
        data = {
            "info": {
                "patient_name": medical_record.patient_name,
                "doctor_name": doctor.get_full_name(),  # 直接使用User模型的get_full_name()方法
                "appointmentNumber": medical_record.appointment_number,
                "description": medical_record.condition_description
            },
            "diagnose": {
                "Diagnose": medical_record.diagnosis_description
            },
            "prescriptions": serializer.data.get('prescriptions', []),
            "examinations": serializer.data.get('examinations', [])
        }
        return Response(data)


class UpdateMedicalRecordView(APIView):
    permission_classes = [IsDoctor]

    def post(self, request):
        appointment_number = request.data.get('info', {}).get('appointmentNumber')
        appointment = Appointment.objects.get(appointment_number=appointment_number)
        medical_record = appointment.medical_record

        serializer = MedicalRecordSerializer(medical_record, data={
            'condition_description': request.data['info']['description'],
            'diagnosis_description': request.data['info']['Diagnose'],
            'prescriptions': request.data['prescriptions'],
            'examinations': request.data['examinations']
        })

        if serializer.is_valid():
            with transaction.atomic():
                serializer.save()
                return Response({"message": "Medical record updated successfully."})
        else:
            return Response(serializer.errors, status=400)

        return Response({"error": "Invalid data"}, status=400)


class UpdateAppointmentView(APIView):

    def post(self, request, *args, **kwargs):
        appointment_number = request.data.get('appointment_number')
        appointment = Appointment.objects.filter(appointment_number=appointment_number).first()
        if not appointment:
            return Response({"error": "Appointment not found"}, status=404)

        serializer = AppointmentUpdateSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Appointment updated successfully"})
        else:
            return Response(serializer.errors, status=400)


class AllConversationsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        conversations = Conversation.objects.all()
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)


class ConversationView(APIView):

    def get(self, request, conversation_id):
        # 获取对话并按照消息创建时间排序
        conversation = Conversation.objects.prefetch_related(
            models.Prefetch('messages', queryset=Message.objects.order_by('created_at'))
        ).get(conversation_id=conversation_id)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)

    def post(self, request, conversation_id):
        conversation = Conversation.objects.get(conversation_id=conversation_id)
        message = Message(conversation=conversation, sender=request.user, text=request.data['text'])
        message.save()
        return Response({"message": "Message sent successfully."})


class PatientConversationView(APIView):
    permission_classes = [IsApprovedPatient]

    def get(self, request):
        # 尝试获取与当前认证患者相关联的对话
        conversation = Conversation.objects.prefetch_related(
            models.Prefetch('messages', queryset=Message.objects.order_by('created_at'))
        ).filter(patient=request.user).first()

        if not conversation:
            # 如果不存在对话，则创建一个新的对话
            conversation = Conversation.objects.create(
                patient=request.user,
                created_at=datetime.datetime.now()  # 确保使用正确的时间
            )

        # 序列化对话数据
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)


class UserProfileView(APIView):

    def get(self, request):
        user = request.user
        if hasattr(user, 'patient'):
            serializer = PatientSerializer(user.patient)
        elif hasattr(user, 'doctor'):
            serializer = DoctorSerializer(user.doctor)
        else:
            return Response({'message': 'No associated patient or doctor profile'}, status=404)

        return Response(serializer.data)