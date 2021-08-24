from rest_framework import serializers

from core.models import Game, Player, Room, User, Vote


class BaseSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")


class UserSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = ("email",)


class PlayerSerializer(BaseSerializer):
    class Meta:
        model = Player
        fields = ("uuid", "name", "avatar_url")


class PlayerWithUserSerializer(PlayerSerializer):
    user = UserSerializer()

    class Meta:
        model = Player
        fields = fields = PlayerSerializer.Meta.fields + ("user",)


class RoomSerializer(BaseSerializer):
    players = PlayerSerializer(many=True)
    admin = PlayerSerializer()
    current_story_id = serializers.UUIDField(format="hex")

    class Meta:
        model = Room
        fields = ("uuid", "players", "admin", "current_story_id")


class VoteSerializer(BaseSerializer):
    player_id = serializers.UUIDField(format="hex")

    class Meta:
        model = Vote
        fields = ("player_id", "score")


class StorySerializer(BaseSerializer):
    votes = VoteSerializer(many=True)

    class Meta:
        model = Game
        fields = (
            "uuid",
            "players",
            "votes",
        )


class StoryIdSerializer(BaseSerializer):
    class Meta:
        model = Game
        fields = ("uuid",)


class MessageSerializer(serializers.Serializer):
    message_type = serializers.CharField()


class PlayerConnectedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerFinishedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerNotFinishedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerLeftMessageSerializer(MessageSerializer):
    player = PlayerSerializer()
    needs_new_admin = serializers.BooleanField()


class PlayerReplacedMessageSerializer(MessageSerializer):
    old_player = PlayerSerializer()
    new_player = PlayerSerializer()


class NewAdminMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class StoryStartsMessageSerializer(MessageSerializer):
    story = StoryIdSerializer()
