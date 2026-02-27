import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaUserCircle } from "react-icons/fa";
import { CiCircleChevDown } from "react-icons/ci";

function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  return (
    <div className="navbar">
      <h2 className="logo" style={{ color: "white", margin: "10px 40px", fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif" }}>CollabDraw</h2>
      <div class='navitems'>
        <Link to="/"><button>Home</button></Link>
        <Link to="/login"><button>Login</button></Link>
        {/* <button onClick={handleLogout}>Logout</button> */}
      </div>


      {user && (
        <div style={{ position: "relative", cursor: "pointer" }}>

          <div className="profile" onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {user?.picture ? (
  <img
    src={user.picture}
    alt="profile"
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid white"
    }}
  />
) : (
  <FaCircleUser
    size={35}
    color="white"
  />
)}
            <span style={{ color: "white" }}>{user.name?.split(" ")[0]}</span>
            <CiCircleChevDown style={{color:"white",fontSize:"24px"}}/>
          </div>

          {open && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "40px",
              backgroundColor: "white",
              color: "black",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              minWidth: "200px"
            }}>
              <p><strong>{user.name}</strong></p>
              <p style={{ fontSize: "14px", color: "gray" }}>{user.email}</p>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                style={{
                  marginTop: "8px",
                  backgroundColor: "#EF4444",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default NavBar;