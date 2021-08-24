from django.http import HttpResponse, HttpResponseForbidden

from core.models import Player


def requires_player(function):
    def wrap(request, *args, **kwargs):
        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(uuid=player_id)
        except (KeyError, Player.DoesNotExist):
            return HttpResponse(status=401)

        return function(request, player, *args, **kwargs)

    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


def check_player_id(function):
    def wrap(self, request, *args, **kwargs):
        try:
            player_id = request.session["player_id"]
        except KeyError:
            return HttpResponse(status=401)
        if player_id.replace("-", "") != kwargs["uuid"]:
            return HttpResponseForbidden()
        return function(self, request, *args, **kwargs)

    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap
