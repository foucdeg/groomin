import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class BaseModel(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        get_latest_by = "created_at"

    def __str__(self):
        return f"{self.__class__.__name__.lower()}:{str(self.uuid)[:6]}"


class UserManager(BaseUserManager):
    """A custom model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class Room(BaseModel):
    admin = models.ForeignKey(
        "Player", on_delete=models.CASCADE, related_name="room_as_admin"
    )
    current_story = models.ForeignKey(
        "Story",
        on_delete=models.SET_NULL,
        related_name="room_as_current_story",
        null=True,
        blank=True,
    )


class Player(BaseModel):
    name = models.CharField(max_length=30)
    room = models.ManyToManyField(Room, related_name="players")
    avatar_url = models.CharField(max_length=500, blank=True, null=True)


class User(AbstractUser):
    email = models.EmailField("email address", unique=True)
    player = models.OneToOneField(
        Player, on_delete=models.CASCADE, related_name="user", null=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def save(self, *args, **kwargs):
        "Set username to email when it's empty."
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class Story(BaseModel):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="stories")
    votes_cast = models.IntegerField(default=0)

    players = models.ManyToManyField(
        to=Player, through="Vote", related_name="stories"
    )


class Vote(BaseModel):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name="votes")
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    score = models.CharField(max_length=30, blank=True, null=True)
