from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    # JWT配置
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # 患者注册
    path('register/', PatientRegistration.as_view(), name='patient_register'),
    # 登录
    path('login/', LoginView.as_view(), name='login'),
    # 获取所有注册未被确认的患者用户
    path('approval/', PatientsApprovalView.as_view(), name='unapproved-patients'),
    # 确认注册
    path('confirm-registration/', ConfirmRegistrationView.as_view(), name='confirm-registration'),
    # 医生注册
    path('doctor/register/', DoctorRegistrationView.as_view(), name='doctor-registration'),
    # 排班
    path('schedule/', ScheduleView.as_view(), name='create-schedules'),
    # 根据医生获取医生排班
    path('doctor-schedule/', DoctorSchedulesView.as_view(), name='doctor-schedules'),
    # 根据部门获取slot
    path('available-times/<str:department>/', AvailableTimesView.as_view(), name='available-times'),
    # 患者确认预约
    path('make-appointment/', CreateAppointmentView.as_view(), name='make-appointment'),
    # 医生获取自己的预约
    path('doctorappointmentlist/', DoctorAppointmentsView.as_view(), name='doctor-appointments'),
    # 患者获取自己的预约
    path('patientappointmentlist/', PatientAppointmentsView.as_view(), name='patient-appointments'),
    # 更改预约状态
    path('update-appointment/', UpdateAppointmentView.as_view(), name='update-appointment'),
    # 获取就诊页面信息
    path('medical-records/<str:appointment_number>/', MedicalRecordView.as_view(), name='medical-record-detail'),
    # 修改就诊信息
    path('update-medical-record/', UpdateMedicalRecordView.as_view(), name='update-medical-record'),
    # 获取个人信息
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    # 对话
    path('conversations/', AllConversationsView.as_view(), name='all-conversations'),
    path('conversation/<str:conversation_id>/', ConversationView.as_view(), name='conversation'),
    path('my-conversation/', PatientConversationView.as_view(), name='my-conversation'),

]


