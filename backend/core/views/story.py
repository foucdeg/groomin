import json
import logging

from django.core.exceptions import ValidationError
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.http import require_GET, require_http_methods
from rest_framework.generics import RetrieveAPIView

from core.decorators import requires_player
from core.models import Story
from core.serializers import StorySerializer
from core.service.game_service import VoteException, devote, vote

logger = logging.getLogger(__name__)


class StoryRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Story.objects.prefetch_related(
        "votes", "votes__player", "players"
    ).all()
    serializer_class = StorySerializer


@require_http_methods(["POST", "DELETE"])
@requires_player
def submit_vote(request, player, story_id):
    try:
        json_body = json.loads(request.body)
        score = json_body.get("score")

        try:
            validate_score(score)
        except ValidationError:
            raise VoteException("Invalid vote: %s" % score)
        try:
            story = Story.objects.get(uuid=story_id)
        except Story.DoesNotExist:
            raise VoteException("Pad step with uuid %s does not exist" % story_id)

        if player not in story.players:
            raise VoteException("You cannot vote for this story")

        score = request.POST.get("score")

        if request.method == "POST":
            vote(player, story, score)

            return HttpResponse(status=201)

        if request.method == "DELETE":
            devote(player, story, None)

            return HttpResponse(status=204)

    except VoteException as e:
        return HttpResponseBadRequest(e.message)


@require_GET
@requires_player
def player_should_join(request, player, story_id):
    try:
        story = Story.objects.get(uuid=story_id)
    except Story.DoesNotExist:
        return HttpResponseBadRequest("Story with uuid %s does not exist" % story_id)

    return JsonResponse({"is_in_story": player in story.players})
