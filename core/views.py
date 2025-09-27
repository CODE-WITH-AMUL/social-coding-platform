from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Project, Like, Comment
from .serializers import ProjectSerializer, LikeSerializer, CommentSerializer

# Project List/Create (list public, create requires auth)
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]  # Allow public list; override for create

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise permissions.PermissionDenied("Authentication required to upload projects.")
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

# Project Detail (public view, but auth for updates if needed)
class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]  # Public view; add owner-only for update/delete later

# Like/Unlike
class LikeView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        project = generics.get_object_or_404(Project, pk=pk)
        like, created = Like.objects.get_or_create(user=request.user, project=project)
        if not created:
            like.delete()  # Toggle: If already liked, unlike
            return Response({"detail": "Unliked"}, status=status.HTTP_200_OK)
        return Response({"detail": "Liked"}, status=status.HTTP_201_CREATED)

# Comment List/Create
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]  # Require auth for create; allow public list if desired

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Comment.objects.filter(project_id=project_id).order_by('-created_at')

    def perform_create(self, serializer):
        project = generics.get_object_or_404(Project, pk=self.kwargs['project_id'])
        serializer.save(user=self.request.user, project=project)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]  # Public comments view