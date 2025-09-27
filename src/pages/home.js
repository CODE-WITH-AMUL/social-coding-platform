import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    file: null,
    image: null,
    tags: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("trending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchProjects]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", newProject.title);
    formData.append("description", newProject.description);
    formData.append("tags", newProject.tags);
    if (newProject.file) formData.append("file_path", newProject.file);
    if (newProject.image) formData.append("image", newProject.image);

    try {
      await axios.post("http://localhost:8000/api/projects/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setNewProject({ title: "", description: "", file: null, image: null, tags: "" });
      setImagePreview(null);
      setIsUploadModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleLike = async (id) => {
    if (!user) {
      navigate("/login");
      return;
    }
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

  const handleComment = async (id, comment) => {
    if (!user) {
      navigate("/login");
      return;
    }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProject({ ...newProject, image: file });
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedByLikes = [...filteredProjects].sort((a, b) => b.likes_count - a.likes_count);
  const sortedByDate = [...filteredProjects].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const displayedProjects = activeTab === "trending" ? sortedByLikes.slice(0, 3) : sortedByDate.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Embedded CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        
        @keyframes floating {
          0% { transform: translate(0, 0px); }
          50% { transform: translate(0, -10px); }
          100% { transform: translate(0, 0px); }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover-lift">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md floating">
                <span className="text-white font-bold text-xl">💻</span>
              </div>
              <span className="text-2xl font-bold gradient-text">ProjectHub</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search projects, tags, technologies..."
                  className="w-full px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 glass-effect"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover-lift">
                🏠 Home
              </Link>
              <Link to="/explore" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover-lift">
                🌐 Explore
              </Link>
              <Link to="/community" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover-lift">
                👥 Community
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn-primary text-white px-6 py-3 rounded-full font-medium shadow-lg flex items-center space-x-2"
                  >
                    <span>🚀</span>
                    <span>Upload Project</span>
                  </button>
                  <div className="relative group">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer shadow-md hover-lift">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 glass-effect">
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2">
                        <span>📊</span>
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2">
                        <span>👤</span>
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover-lift">
                    🔑 Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-white px-6 py-3 rounded-full font-medium shadow-lg"
                  >
                    ✨ Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl floating" style={{animationDelay: '0s'}}></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl floating" style={{animationDelay: '1.5s'}}></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              Build, Share & <span className="text-gradient">Collaborate</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers sharing their projects, getting feedback, and growing together. 
              From beginner to expert, there's a place for every creator. 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-2xl hover-lift flex items-center space-x-2"
                >
                  <span>🚀</span>
                  <span>Share Your Project</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-2xl hover-lift flex items-center space-x-2"
                  >
                    <span>✨</span>
                    <span>Start Creating</span>
                  </Link>
                  <Link
                    to="/explore"
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-200 shadow-2xl hover-lift flex items-center space-x-2"
                  >
                    <span>🌐</span>
                    <span>Explore Projects</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 gradient-text">🔥 Featured Projects</h2>
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-full glass-effect">
                <button
                  onClick={() => setActiveTab("trending")}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === "trending"
                      ? "bg-white text-blue-600 shadow-md hover-lift"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <span>📈</span>
                  <span>Trending</span>
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === "recent"
                      ? "bg-white text-blue-600 shadow-md hover-lift"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <span>🕒</span>
                  <span>Recent</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg h-96 animate-pulse shimmer">
                    <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedProjects.length === 0 ? (
              <div className="text-center py-16 glass-effect rounded-2xl">
                <div className="text-8xl mb-4 floating">💡</div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No projects yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share your amazing project!</p>
                {user && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn-primary text-white px-6 py-3 rounded-full font-medium shadow-lg"
                  >
                    🚀 Share Your First Project
                  </button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {displayedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border border-gray-100 overflow-hidden glass-effect"
                  >
                    {project.image && (
                      <img
                        src={`http://localhost:8000${project.image}`}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                            {project.user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-700">{project.user.username}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                      {project.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.split(",").map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 text-xs rounded-full hover:from-blue-200 hover:to-purple-200 transition-all duration-200"
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => handleLike(project.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover-lift ${
                            project.likes_count > 0 ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-gray-500 hover:text-red-500"
                          }`}
                        >
                          <span className="text-lg">❤️</span>
                          <span className="font-medium">{project.likes_count}</span>
                        </button>

                        {project.file_path && (
                          <a
                            href={`http://localhost:8000${project.file_path}`}
                            className="flex items-center space-x-2 px-4 py-2 btn-primary text-white rounded-full hover-lift shadow-md"
                          >
                            <span>⬇️</span>
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Project Feed */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 gradient-text text-center">📌 Project Feed</h2>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg h-64 animate-pulse shimmer"></div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm glass-effect">
                <div className="text-8xl mb-4 floating">👨‍💻</div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No projects found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or be the first to share!</p>
                {user && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="btn-primary text-white px-6 py-3 rounded-full font-medium shadow-lg"
                  >
                    🚀 Share Your First Project
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {sortedByDate.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 card-hover glass-effect"
                  >
                    {/* Project Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm hover-lift">
                          {project.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.user.username}</h3>
                          <p className="text-sm text-gray-500">{new Date(project.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-600 text-sm rounded-full font-medium">
                        🚀 Project
                      </span>
                    </div>

                    {/* Project Content */}
                    <h4 className="text-2xl font-bold text-gray-900 mb-3 gradient-text">{project.title}</h4>
                    <p className="text-gray-700 mb-4 leading-relaxed text-lg">{project.description}</p>

                    {/* Project Image */}
                    {project.image && (
                      <img
                        src={`http://localhost:8000${project.image}`}
                        alt={project.title}
                        className="w-full rounded-2xl mb-4 max-h-96 object-cover transition-transform duration-300 hover:scale-105 shadow-md"
                      />
                    )}

                    {/* Tags */}
                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.split(",").map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-sm rounded-full hover:from-blue-100 hover:to-purple-100 transition-all duration-200 hover-lift"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(project.id)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-all duration-200 hover-lift"
                        >
                          <span className="text-xl">❤️</span>
                          <span className="font-medium">{project.likes_count} Likes</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-all duration-200 hover-lift">
                          <span className="text-xl">💬</span>
                          <span className="font-medium">{project.comments_count || 0} Comments</span>
                        </button>
                      </div>

                      {project.file_path && (
                        <a
                          href={`http://localhost:8000${project.file_path}`}
                          className="flex items-center space-x-2 px-4 py-2 btn-primary text-white rounded-full hover-lift shadow-md"
                        >
                          <span>📥</span>
                          <span>Download Code</span>
                        </a>
                      )}
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <h5 className="font-semibold text-gray-900 mb-3 text-lg">💬 Comments</h5>

                      {/* Existing Comments */}
                      <div className="space-y-4 mb-4">
                        {project.comments && project.comments.length > 0 ? (
                          project.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                {comment.user.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-2xl p-4 shadow-sm glass-effect">
                                  <span className="font-semibold text-sm block mb-1">{comment.user.username}</span>
                                  <p className="text-gray-700 text-sm">{comment.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">💭 No comments yet. Be the first to comment!</p>
                        )}
                      </div>

                      {/* Add Comment */}
                      {user && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const comment = e.target.comment.value;
                            if (comment.trim()) {
                              handleComment(project.id, comment);
                              e.target.reset();
                            }
                          }}
                          className="flex space-x-2"
                        >
                          <input
                            type="text"
                            name="comment"
                            placeholder="💭 Add a comment..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 glass-effect"
                            required
                          />
                          <button
                            type="submit"
                            className="px-6 py-3 btn-primary text-white rounded-full hover-lift shadow-md"
                          >
                            Post
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full glass-effect border border-white/20">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900 gradient-text">🚀 Share Your Project</h3>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setImagePreview(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 hover-lift"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📝 Project Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 glass-effect"
                  placeholder="Awesome React Project..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📄 Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 shadow-sm transition-all duration-200 glass-effect"
                  placeholder="Describe your project, technologies used, challenges faced..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🏷️ Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 glass-effect"
                  placeholder="react, javascript, webdev, opensource"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📁 Project Files</label>
                  <input
                    type="file"
                    accept=".zip,.rar,.py,.js,.html,.css,.pdf,.txt"
                    onChange={(e) => setNewProject({ ...newProject, file: e.target.files[0] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 glass-effect"
                  />
                  {newProject.file && <p className="mt-2 text-sm text-gray-600">✅ {newProject.file.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🖼️ Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 glass-effect"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 w-full h-48 object-cover rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setImagePreview(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover-lift"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 btn-primary text-white rounded-lg font-medium shadow-lg hover-lift"
                >
                  🚀 Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md floating">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="text-xl font-bold gradient-text">ProjectHub</span>
              </div>
              <p className="text-gray-400">
                A community platform for developers to share, collaborate, and grow together. 🌟
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">🌐 Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/explore" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>📂</span>
                    <span>Projects</span>
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>👥</span>
                    <span>Community</span>
                  </Link>
                </li>
                <li>
                  <Link to="/trending" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>📈</span>
                    <span>Trending</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">📚 Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/docs" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>📖</span>
                    <span>Documentation</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>✍️</span>
                    <span>Blog</span>
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>💬</span>
                    <span>Support</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">🔗 Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>ℹ️</span>
                    <span>About</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>📞</span>
                    <span>Contact</span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-all duration-200 hover-lift flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Privacy</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p className="flex items-center justify-center space-x-2">
              <span>©</span>
              <span>{new Date().getFullYear()} ProjectHub. All rights reserved. 🚀</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;