
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportScam from "./pages/ReportScam";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import SearchScam from "./pages/SearchScam";
import PhishingSimulator from "./pages/PhishingSimulator";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Blogs from "./pages/Blogs";
import Tools from "./pages/Tools";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportScam />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/search" element={<SearchScam />} />
        <Route path="/simulator" element={<PhishingSimulator />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/tools" element={<Tools />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
