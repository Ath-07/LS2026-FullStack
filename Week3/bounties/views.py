from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework import permissions, status, viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from bounties.models import Bounty
from bounties.permissions import IsOwner
from bounties.serializers import BountySerializer, UserSerializer


class UserCreateView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(user).data,
                "message": "User created successfully",
            },
            status=status.HTTP_201_CREATED,
        )


class BountyViewSet(viewsets.ModelViewSet):
    serializer_class = BountySerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Bounty.objects.filter(owner=self.request.user).order_by("-created_at")

    def _cache_key(self):
        return f"bounty_list_{self.request.user.id}"

    def _invalidate_cache(self):
        cache.delete(self._cache_key())

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        self._invalidate_cache()

    def perform_update(self, serializer):
        serializer.save()
        self._invalidate_cache()

    def perform_destroy(self, instance):
        self._invalidate_cache()
        instance.delete()

    def list(self, request, *args, **kwargs):
        cached = cache.get(self._cache_key())
        if cached is not None:
            return Response(cached)
        response = super().list(request, *args, **kwargs)
        cache.set(self._cache_key(), response.data, 60)
        return response
