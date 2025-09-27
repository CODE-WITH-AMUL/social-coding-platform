import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Dashbord = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", description: "", file: null, image: null });

  // Fetch all projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  // Upload a new project
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to upload projects!");

    const formData = new FormData();
    formData.append("title", newProject.title);
    formData.append("description", newProject.description);
    if (newProject.file) formData.append("file_path", newProject.file);
    if (newProject.image) formData.append("image", newProject.image);

    try {
      await axios.post("http://localhost:8000/api/projects/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setNewProject({ title: "", description: "", file: null, image: null });
      fetchProjects();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // Like a project
  const handleLike = async (id) => {
    try {
      await axios.post(
        `http://localhost:8000/api/projects/${id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      fetchProjects();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // Comment on a project
  const handleComment = async (id, comment) => {
    try {
      await axios.post(
        `http://localhost:8000/api/projects/${id}/comments/`,
        { comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      fetchProjects();
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  return (
    <div className="home-container">
      <h1>🚀 ProjectHub – Share & Discover Projects</h1>

      {/* Upload Section */}
      {user && (
        <form className="upload-form" onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            required
          />
          <input
            type="file"
            accept=".zip,.rar,.py,.js,.html,.css,.pdf"
            onChange={(e) => setNewProject({ ...newProject, file: e.target.files[0] })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })}
          />
          <button type="submit">Upload Project</button>
        </form>
      )}

      {/* Trending Projects */}
      <h2>🔥 Trending Projects</h2>
      <div className="projects-list">
        {projects.length === 0 ? (
          <p>No projects yet. Be the first to upload!</p>
        ) : (
          projects.map((proj) => (
            <div className="project-card" key={proj.id}>
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>
              {proj.image && <img src={`http://localhost:8000${proj.image}`} alt={proj.title} className="project-image" />}
              {proj.file_path && (
                <a href={`http://localhost:8000${proj.file_path}`} target="_blank" rel="noreferrer" className="download-btn">
                  Download
                </a>
              )}
              <div className="project-actions">
                <button onClick={() => handleLike(proj.id)}>👍 {proj.likes_count}</button>
              </div>

              {/* Comments Section */}
              <div className="comments">
                <h4>Comments</h4>
                {proj.comments_count === 0 && <p>No comments yet.</p>}
                {proj.comments &&
                  proj.comments.map((c) => (
                    <p key={c.id}>
                      <strong>{c.user.username}:</strong> {c.comment}
                    </p>
                  ))}
                {user && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleComment(proj.id, e.target.comment.value);
                      e.target.reset();
                    }}
                  >
                    <input type="text" name="comment" placeholder="Write a comment..." required />
                    <button type="submit">Post</button>
                  </form>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashbord;
