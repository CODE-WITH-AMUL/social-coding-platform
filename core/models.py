from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class TimeStamp(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True


class Project(TimeStamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=500)
    description = models.TextField()
    file_path = models.FileField(upload_to='projects/')
    image = models.ImageField(upload_to='projects/images/')

    def __str__(self):
        return self.title

    @property
    def total_likes(self):
        return self.likes.count()

    @property
    def total_comments(self):
        return self.comments.count()


class Like(TimeStamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='likes')

    class Meta:
        unique_together = ('user', 'project')

    def __str__(self):
        return f"{self.user.username} likes {self.project.title}"


class Comment(TimeStamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()

    def __str__(self):
        return f"{self.user.username} commented on {self.project.title}"
