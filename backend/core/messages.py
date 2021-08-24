from core.models import Player, Story


class PlayerConnectedMessage:
    message_type = "PLAYER_CONNECTED"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import PlayerConnectedMessageSerializer

        return PlayerConnectedMessageSerializer(self).data


class PlayerLeftMessage:
    message_type = "PLAYER_LEFT"
    player = None
    needs_new_admin = False

    def __init__(self, player: Player, needs_new_admin: bool):
        self.player = player
        self.needs_new_admin = needs_new_admin

    def serialize(self):
        from core.serializers import PlayerLeftMessageSerializer

        return PlayerLeftMessageSerializer(self).data


class PlayerReplacedMessage:
    message_type = "PLAYER_REPLACED"
    old_player = None
    new_player = None

    def __init__(self, old_player: Player, new_player: Player):
        self.old_player = old_player
        self.new_player = new_player

    def serialize(self):
        from core.serializers import PlayerReplacedMessageSerializer

        return PlayerReplacedMessageSerializer(self).data


class NewAdminMessage:
    message_type = "NEW_ADMIN"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import NewAdminMessageSerializer

        return NewAdminMessageSerializer(self).data


class PlayerFinishedMessage:
    message_type = "PLAYER_FINISHED"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import PlayerFinishedMessageSerializer

        return PlayerFinishedMessageSerializer(self).data


class PlayerNotFinishedMessage:
    message_type = "PLAYER_NOT_FINISHED"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import PlayerFinishedMessageSerializer

        return PlayerFinishedMessageSerializer(self).data


class StoryStartsMessage:
    message_type = "STORY_STARTS"
    story = None

    def __init__(self, story: Story):
        self.story = story

    def serialize(self):
        from core.serializers import StoryStartsMessageSerializer

        return StoryStartsMessageSerializer(self).data
