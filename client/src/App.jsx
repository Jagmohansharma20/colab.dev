import NavBar from './component/NavBar';
import Home from './component/Home';
import Room from './component/Room';
import './App.css';
import Login from "./component/Login";  // adjust path
import LoginSuccess from "./component/LoginSuccess";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './component/ProtectedRoute';
function App() {
 

  return (
    <div class="r1">
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
      


    </div>
  )
}

export default App
