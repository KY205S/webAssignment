from rest_framework import permissions
from .models import Admin, Patient


class IsAdminUser(permissions.BasePermission):
    """
    允许访问只有当JWT中的用户为管理员时。
    """

    def has_permission(self, request, view):
        user = request.user
        if user and user.is_authenticated:
            # 检查是否存在对应的Admin记录
            return Admin.objects.filter(user=user).exists()
        return False


class IsAuthenticatedAndApprovedPatient(permissions.BasePermission):
    """
    允许访问只有当用户已通过身份验证，并且如果是Patient用户，则必须已获批准。
    """

    def has_permission(self, request, view):
        # 首先检查用户是否已认证
        if not request.user or not request.user.is_authenticated:
            return False

        # 如果用户是Patient，检查是否已批准
        try:
            patient = Patient.objects.get(user=request.user)
            if not patient.is_approved:
                return False
        except Patient.DoesNotExist:
            pass  # 如果不是Patient，不做进一步限制

        # 如果用户不是Patient或已是批准的Patient，允许访问
        return True


class IsApprovedPatient(permissions.BasePermission):
    """
    允许访问只有当用户是被批准的病人时。
    """

    def has_permission(self, request, view):
        # 检查当前用户是否是病人并且已被批准
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # 检查用户是否有病人身份并且该病人身份已经被批准
        if hasattr(user, 'patient') and user.patient.is_approved:
            return True

        return False


class IsDoctorOrAdmin(permissions.BasePermission):
    """
    允许访问只有当用户是医生或管理员时。
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # 检查用户是否是医生或者是否有Admin关联对象
        is_doctor = hasattr(user, 'doctor')
        is_admin = hasattr(user, 'admin')

        return is_doctor or is_admin


class IsDoctor(permissions.BasePermission):
    """
    允许访问只有当用户是医生时。
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # 检查用户是否是医生或者是否有Admin关联对象
        is_doctor = hasattr(user, 'doctor')

        return is_doctor