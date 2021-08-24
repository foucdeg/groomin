import logging

from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response

from core.decorators import check_player_id
from core.models import Player
from core.serializers import PlayerSerializer, PlayerWithUserSerializer
from core.service.auth_service import get_player_rank, save_avatar

logger = logging.getLogger(__name__)


@require_GET
def get_me(request):
    try:
        player_id = request.session["player_id"]
        player = Player.objects.get(uuid=player_id)

        if request.GET.get("withRank") == "true":
            player.rank = get_player_rank(player)

    except (KeyError, Player.DoesNotExist):
        return JsonResponse(None, safe=False)

    if request.user.is_authenticated:
        return JsonResponse(PlayerWithUserSerializer(player).data)

    return JsonResponse(PlayerSerializer(player).data)


class PlayerAPIView(RetrieveUpdateAPIView):
    lookup_field = "uuid"
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    @check_player_id
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        avatar = request.data.get("avatar")
        if avatar:
            instance.avatar_url = save_avatar(instance, avatar)

        self.perform_update(serializer)

        return Response(serializer.data)

    @check_player_id
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
