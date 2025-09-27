from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView, LikeView, CommentListCreateView

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='project_list_create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project_detail'),
    path('projects/<int:pk>/like/', LikeView.as_view(), name='like_project'),
    path('projects/<int:project_id>/comments/', CommentListCreateView.as_view(), name='comment_list_create'),
]