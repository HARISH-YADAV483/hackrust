import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const Admin = () => {
  const [reports, setReports] = useState([]);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    const fetchReports = async () => {
      const res = await axios.get("/admin/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(res.data);
    };

    fetchReports();
  }, []);

  const approve = async (id) => {
    await axios.put(`/admin/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Approved");
    window.location.reload();
  };

  const reject = async (id) => {
    await axios.put(`/admin/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Rejected");
    window.location.reload();
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      {reports.map((r) => (
        <div key={r._id} style={{ border: "1px solid", margin: "10px", padding: "10px" }}>
          <p>{r.description}</p>
          <p>Score: {r.scamScore}</p>

          <button onClick={() => approve(r._id)}>Approve</button>
          <button onClick={() => reject(r._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;