
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportScam from "./pages/ReportScam";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import SearchScam from "./pages/SearchScam";
import PhishingSimulator from "./pages/PhishingSimulator";
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<ReportScam />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
         <Route path="/search" element={<SearchScam />} />
         <Route path="/simulator" element={<PhishingSimulator />} />
      </Routes>
    </>
  );
}

export default App;
