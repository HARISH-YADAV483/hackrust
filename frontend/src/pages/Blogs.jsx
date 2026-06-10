import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import BASE_URL from "../api/baseUrl";
import "../Common.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/blogs/approved");
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await axios.post("/blogs", formData, {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("Blog submitted! Waiting for admin approval.");
      setTitle("");
      setContent("");
      setImage(null);
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      setMessage("Failed to submit blog.");
    }
  };

  return (
    <div className="container-center" style={{ minHeight: "calc(100vh - 80px)", justifyContent: "flex-start", padding: "1.5rem 1rem" }}>
      <header className="auth-header" style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h2>🤝 Community Blogs</h2>
        <p>Expert insights and security tips from our members</p>
        
        {user && (
          <button 
            className="btn-primary" 
            style={{ marginTop: "1.5rem", padding: "0.8rem 2rem" }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Write a Blog"}
          </button>
        )}
      </header>

      {showForm && (
        <div className="card-glass" style={{ width: "100%", maxWidth: "800px", marginBottom: "3rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                placeholder="Catchy title for your security tip..."
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea 
                className="form-input" 
                style={{ minHeight: "200px", resize: "vertical" }}
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required
                placeholder="Share your experience or knowledge here..."
              ></textarea>
            </div>
            <div className="form-group">
              <label>Feature Image</label>
              <input 
                type="file" 
                className="form-input" 
                onChange={(e) => setImage(e.target.files[0])} 
                accept="image/*"
              />
            </div>
            <button type="submit" className="btn-primary">Submit for Review</button>
          </form>
        </div>
      )}

      {message && (
        <div style={{ 
          padding: "1rem", 
          background: "rgba(34, 197, 94, 0.2)", 
          border: "1px solid #22c55e", 
          borderRadius: "8px", 
          marginBottom: "2rem",
          color: "#4ade80"
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        width: "100%", 
        maxWidth: "1200px", 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", 
        gap: "1.5rem",
        padding: "0 0.5rem"
      }}>
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1" }}>No blogs yet. Be the first to write one!</p>
        ) : (
          blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))
        )}
      </div>
    </div>
  );
};

const BlogCard = ({ blog }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const isLongContent = blog.content.length > maxLength;
  const displayContent = isExpanded ? blog.content : blog.content.substring(0, maxLength) + (isLongContent ? "..." : "");

  return (
    <div className="card-glass" style={{ 
      maxWidth: "none", 
      padding: "1.5rem", 
      display: "flex", 
      flexDirection: "column",
      height: "100%"
    }}>
      <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "white" }}>{blog.title}</h3>
      <div style={{ fontSize: "0.80rem", color: "var(--text-muted)", marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <span>By <strong>{blog.author?.name}</strong></span>
        <span>•</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      
      {blog.image && (
        <img 
          src={`${BASE_URL}/uploads/${blog.image}`} 
          alt={blog.title} 
          style={{ 
            width: "100%", 
            height: "200px", 
            objectFit: "cover", 
            borderRadius: "8px", 
            marginBottom: "1rem" 
          }}
        />
      )}
      
      <p style={{ 
        lineHeight: "1.5", 
        color: "#cbd5e1", 
        whiteSpace: "pre-wrap", 
        fontSize: "0.95rem",
        flex: 1
      }}>
        {displayContent}
      </p>

      {isLongContent && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "none",
            border: "none",
            color: "var(--primary, #133b97)",
            cursor: "pointer",
            fontWeight: "bold",
            padding: "0.5rem 0",
            textAlign: "left",
            fontSize: "0.9rem",
            marginTop: "0.5rem"
          }}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default Blogs;
