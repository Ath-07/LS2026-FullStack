from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class PendingDoctorsListView(generics.ListAPIView):
    queryset = User.objects.filter(role="doctor", is_approved=False)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(["PATCH"])
@permission_classes([permissions.IsAdminUser])
def approve_doctor(request, user_id):
    try:
        user = User.objects.get(id=user_id, role="doctor", is_approved=False)
    except User.DoesNotExist:
        return Response({"detail": "Doctor not found or already approved"}, status=status.HTTP_404_NOT_FOUND)

    user.is_approved = True
    user.approved_by = request.user
    user.approved_at = timezone.now()
    user.save()
    return Response(UserSerializer(user).data)


@api_view(["DELETE"])
@permission_classes([permissions.IsAdminUser])
def reject_doctor(request, user_id):
    try:
        user = User.objects.get(id=user_id, role="doctor", is_approved=False)
    except User.DoesNotExist:
        return Response({"detail": "Doctor not found or already approved"}, status=status.HTTP_404_NOT_FOUND)

    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
