import { useEffect, useState } from "react";
import { getProfile, uploadProfilePic } from "../api/userApi";
import BASE_URL from "../api/baseUrl";
import "../Common.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const fetchProfile = async () => {
    try {
      const data = await getProfile(token);
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadProfilePic(file, token);
      await fetchProfile();
      alert("Profile picture updated!");
    } catch (err) {
      alert("Upload failed.");
    }
  };

  return (
    <div className="container-center" style={{ minHeight: "calc(100vh - 80px)" }}>
      <div className="card-glass" style={{ maxWidth: "600px" }}>
        <div className="auth-header">
          <h2>Your Profile</h2>
          <p>Manage your account and track your progress</p>
        </div>

        {user && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
            <div style={{ position: "relative" }}>
              <img
                src={user.profilePic ? `${BASE_URL}/uploads/${user.profilePic}` : "https://via.placeholder.com/150"}
                width="150"
                height="150"
                alt="Profile"
                style={{ borderRadius: "50%", border: "4px solid var(--primary)", objectFit: "cover", backgroundColor: "#1e293b" }}
              />
              <label className="btn-primary" style={{ position: "absolute", bottom: "-10px", right: "10px", padding: "8px 12px", fontSize: "0.8rem", width: "auto", cursor: "pointer" }}>
                <span>Edit</span>
                <input type="file" hidden onChange={handleUpload} />
              </label>
            </div>

            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group" style={{ background: "rgba(15,23,42,0.4)", padding: "1rem", borderRadius: "10px" }}>
                <label>Name</label>
                <div style={{ fontWeight: "600", color: "#fff" }}>{user.name}</div>
              </div>
              <div className="form-group" style={{ background: "rgba(15,23,42,0.4)", padding: "1rem", borderRadius: "10px" }}>
                <label>Email</label>
                <div style={{ fontWeight: "600", color: "#fff" }}>{user.email}</div>
              </div>
              <div className="form-group" style={{ background: "rgba(15,23,42,0.4)", padding: "1rem", borderRadius: "10px" }}>
                <label>Total Reports</label>
                <div style={{ fontWeight: "600", color: "#fff", fontSize: "1.2rem" }}>{user.reportsCount || 0}</div>
              </div>
              <div className="form-group" style={{ background: "rgba(15,23,42,0.4)", padding: "1rem", borderRadius: "10px" }}>
                <label>Simulations Passed</label>
                <div style={{ fontWeight: "600", color: "#fff", fontSize: "1.2rem" }}>{user.questionsCount || 0}</div>
              </div>
              <div className="form-group" style={{ background: "rgba(15,23,42,0.4)", padding: "1rem", borderRadius: "10px" }}>
                <label>Blogs Published</label>
                <div style={{ fontWeight: "600", color: "#fff", fontSize: "1.2rem" }}>{user.blogsCount || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;