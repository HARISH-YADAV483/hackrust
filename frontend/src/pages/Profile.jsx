import { useEffect, useState } from "react";
import { getProfile, uploadProfilePic } from "../api/userApi";

const Profile = () => {
  const [user, setUser] = useState(null);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const fetchProfile = async () => {
    const data = await getProfile(token);
    setUser(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    await uploadProfilePic(file, token);
    await fetchProfile(); // ✅ Re-fetch profile to show new image

    alert("Uploaded!");
  };

  return (
    <div>
      <h2>Profile</h2>

      {user && (
        <>
          <img
            src={`http://localhost:5001/uploads/${user.profilePic}`}
            width="120"
            alt="Profile"
          />

          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Reports: {user.reportsCount}</p>
          <p>Questions Done: {user.questionsCount}</p>

          <input type="file" onChange={handleUpload} />
        </>
      )}
    </div>
  );
};

export default Profile;