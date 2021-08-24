import json
import logging

from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseForbidden,
    JsonResponse,
)
from django.views.decorators.http import require_GET, require_http_methods
from rest_framework.generics import RetrieveAPIView

from core.decorators import requires_player
from core.models import Game
from core.serializers import GameSerializer
from core.service.game_service import (
    GameStateException,
    VoteException,
    assert_phase,
    assert_round,
    devote,
    get_round_count,
    start_debrief,
    start_next_round,
    start_reveal,
    switch_to_vote_results,
    vote,
)

logger = logging.getLogger(__name__)


class GameRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Game.objects.prefetch_related(
        "votes", "votes__player", "players"
    ).all()
    serializer_class = GameSerializer


@require_http_methods(["POST", "DELETE"])
@requires_player
def submit_vote(request, player, pad_step_id):
    try:
        try:
            pad_step = PadStep.objects.get(uuid=pad_step_id)
        except PadStep.DoesNotExist:
            raise VoteException("Pad step with uuid %s does not exist" % pad_step_id)

        game = pad_step.pad.game

        assert_phase(game, GamePhase.DEBRIEF)

        if not game.has_player(player):
            raise VoteException("You cannot vote for this game")

        if pad_step.player == player:
            raise VoteException("You cannot vote for your own round")

        if request.method == "POST":
            vote(player, pad_step)

            return HttpResponse(status=201)

        if request.method == "DELETE":
            devote(player, pad_step)

            return HttpResponse(status=204)

    except VoteException as e:
        return HttpResponseBadRequest(e.message)


@require_GET
@requires_player
def player_should_join(request, player, game_id):
    try:
        game = Game.objects.get(uuid=game_id)
    except Game.DoesNotExist:
        return HttpResponseBadRequest("Game with uuid %s does not exist" % game_id)

    return JsonResponse({"is_in_game": game.has_player(player), "phase": game.phase})
