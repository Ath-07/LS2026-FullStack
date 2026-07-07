from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from .models import Department, Doctor, Appointment

User = get_user_model()


class AppointmentPermissionTests(TestCase):
    def setUp(self):
        self.patient = User.objects.create_user(
            username="patient", email="patient@example.com",
            password="pass", role="patient",
        )
        self.doctor_user = User.objects.create_user(
            username="doctor", email="doctor@example.com",
            password="pass", role="doctor", is_approved=True,
        )
        self.staff = User.objects.create_superuser(
            username="admin", email="admin@example.com", password="pass"
        )
        self.dept = Department.objects.create(name="Cardiology")
        self.doc = Doctor.objects.create(
            user=self.doctor_user, department=self.dept, specialty="Cardiologist"
        )
        self.appt = Appointment.objects.create(
            patient=self.patient, doctor=self.doc,
            appointment_date="2026-07-15T10:00:00Z", reason="Checkup"
        )
        self.client = APIClient()

    def test_patient_sees_only_own_appointments(self):
        self.client.force_authenticate(self.patient)
        res = self.client.get("/api/appointments/")
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["patient"]["id"], self.patient.id)

    def test_doctor_sees_only_their_appointments(self):
        self.client.force_authenticate(self.doctor_user)
        res = self.client.get("/api/appointments/")
        self.assertEqual(len(res.data), 1)

    def test_doctor_cannot_see_other_doctors_appointments(self):
        other_doc_user = User.objects.create_user(
            username="doc2", email="doc2@example.com",
            password="pass", role="doctor", is_approved=True,
        )
        other_doc = Doctor.objects.create(
            user=other_doc_user, department=self.dept, specialty="Neurologist"
        )
        Appointment.objects.create(
            patient=self.patient, doctor=other_doc,
            appointment_date="2026-07-16T10:00:00Z", reason="Other"
        )
        self.client.force_authenticate(self.doctor_user)
        res = self.client.get("/api/appointments/")
        for a in res.data:
            self.assertEqual(a["doctor"]["user"]["id"], self.doctor_user.id)

    def test_staff_sees_all_appointments(self):
        self.client.force_authenticate(self.staff)
        res = self.client.get("/api/appointments/")
        self.assertGreaterEqual(len(res.data), 1)

    def test_patient_cannot_create_appointment_for_another_user(self):
        other = User.objects.create_user(
            username="other", email="other@example.com",
            password="pass", role="patient",
        )
        self.client.force_authenticate(self.patient)
        res = self.client.post("/api/appointments/", {
            "patient": other.id,
            "doctor": self.doc.id,
            "appointment_date": "2026-08-01T10:00:00Z",
            "reason": "Should be forced to patient",
        })
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["patient"]["id"], self.patient.id)

    def test_unauthenticated_cannot_create_appointment(self):
        res = self.client.post("/api/appointments/", {
            "patient": self.patient.id,
            "doctor": self.doc.id,
            "appointment_date": "2026-08-01T10:00:00Z",
        })
        self.assertEqual(res.status_code, 401)


class DoctorPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff = User.objects.create_superuser(
            username="admin", email="admin@example.com", password="pass"
        )
        self.user = User.objects.create_user(
            username="user", email="user@example.com", password="pass"
        )
        self.dept = Department.objects.create(name="Cardiology")

    def test_anyone_can_read_doctors(self):
        res = self.client.get("/api/doctors/")
        self.assertEqual(res.status_code, 200)

    def test_only_staff_can_create_doctor(self):
        doctor_user = User.objects.create_user(
            username="doc", email="doc@example.com",
            password="pass", role="doctor", is_approved=True,
        )
        self.client.force_authenticate(self.user)
        res = self.client.post("/api/doctors/", {
            "user_id": doctor_user.id,
            "department": self.dept.id,
            "specialty": "Cardiologist",
        })
        self.assertEqual(res.status_code, 403)

        self.client.force_authenticate(self.staff)
        res = self.client.post("/api/doctors/", {
            "user_id": doctor_user.id,
            "department": self.dept.id,
            "specialty": "Cardiologist",
        })
        self.assertEqual(res.status_code, 201)
