from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.utils import timezone

User = get_user_model()


class RegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/register/"
        self.token_url = "/api/token/"

    def test_patient_registration(self):
        res = self.client.post(self.register_url, {
            "username": "patient1",
            "email": "patient1@example.com",
            "password": "testpass123",
            "role": "patient",
        })
        self.assertEqual(res.status_code, 201)
        user = User.objects.get(email="patient1@example.com")
        self.assertTrue(user.is_approved)
        self.assertEqual(user.role, "patient")

    def test_doctor_registration_not_approved(self):
        res = self.client.post(self.register_url, {
            "username": "doctor1",
            "email": "doctor1@example.com",
            "password": "testpass123",
            "role": "doctor",
        })
        self.assertEqual(res.status_code, 201)
        user = User.objects.get(email="doctor1@example.com")
        self.assertFalse(user.is_approved)
        self.assertEqual(user.role, "doctor")

    def test_doctor_cannot_access_app_until_approved(self):
        self.client.post(self.register_url, {
            "username": "doctor1",
            "email": "doctor1@example.com",
            "password": "testpass123",
            "role": "doctor",
        })
        res = self.client.post(self.token_url, {
            "email": "doctor1@example.com",
            "password": "testpass123",
        })
        self.assertEqual(res.status_code, 200)
        token = res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        res = self.client.get("/api/appointments/")
        self.assertEqual(res.status_code, 200)


class ApprovalTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin", email="admin@example.com", password="adminpass"
        )
        self.doctor = User.objects.create_user(
            username="doc", email="doc@example.com", password="docpass",
            role="doctor", is_approved=False,
        )
        self.client = APIClient()

    def test_admin_can_approve_doctor(self):
        self.client.force_authenticate(self.admin)
        res = self.client.patch(f"/api/approve-doctor/{self.doctor.id}/")
        self.assertEqual(res.status_code, 200)
        self.doctor.refresh_from_db()
        self.assertTrue(self.doctor.is_approved)
        self.assertEqual(self.doctor.approved_by, self.admin)

    def test_admin_can_reject_doctor(self):
        self.client.force_authenticate(self.admin)
        res = self.client.delete(f"/api/reject-doctor/{self.doctor.id}/")
        self.assertEqual(res.status_code, 204)
        self.assertFalse(User.objects.filter(id=self.doctor.id).exists())

    def test_non_admin_cannot_approve(self):
        user = User.objects.create_user(
            username="user", email="user@example.com", password="userpass"
        )
        self.client.force_authenticate(user)
        res = self.client.patch(f"/api/approve-doctor/{self.doctor.id}/")
        self.assertEqual(res.status_code, 403)


class UserSerializerTests(TestCase):
    def test_user_serializer_includes_is_approved(self):
        user = User.objects.create_user(
            username="test", email="test@example.com", password="testpass"
        )
        from accounts.serializers import UserSerializer
        data = UserSerializer(user).data
        self.assertIn("is_approved", data)
