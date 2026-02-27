import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    const newRoomId = Math.random().toString(36).substring(2, 8);

    // Pass name using state
    navigate(`/room/${newRoomId}`, { state: { name } });
  };

  const handleJoinRoom = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!roomCode.trim()) {
      alert("Please enter Room Code");
      return;
    }

    navigate(`/room/${roomCode}`, { state: { name } });
  };

  return (
    <div className="homediv">

      {/* CREATE SECTION */}
      <div className="homedivchild">
        <h2
          style={{
            color: "#042e71",
            padding: "0px 20px",
            marginTop: "0px",
            borderRadius: "19px",
          }}
        >
          Create New WhiteBoard
        </h2>

        <p style={{ margin: "50px 20px " ,color:"#58677b"}}>
          Only host can have permissions to create the room with whiteboard
        </p>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter your name"
          style={{ margin: "10px 20px", fontSize: "18px" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="createbtn"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>


      {/* JOIN SECTION */}
      <div className="homedivchild">
        <h2
          style={{
            color: "#042e71",
            padding: "0px 60px",
            marginTop: "0px",
            borderRadius: "19px",
          }}
        >
          Join The Room
        </h2>

        <p style={{ margin: "40px 20px ",color:"#4c5868" }}>
          any user can join the live room using the room code.
        </p>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter your name"
          style={{ margin: "2px 20px", fontSize: "18px" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Room Input */}
        <input
          type="text"
          placeholder="Room code.."
          style={{ margin: "10px 20px", fontSize: "20px" }}
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          className="joinbtn"
          onClick={handleJoinRoom}
        >
          Join
        </button>
      </div>

    </div>
  );
}

export default Home;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();
//   const [roomCode, setRoomCode] = useState("");
//   const [name, setName] = useState("");

//   const handleCreateRoom = () => {
//     if (!name.trim()) {
//       alert("Please enter your name");
//       return;
//     }
//     const newRoomId = Math.random().toString(36).substring(2, 8);
//     navigate(`/room/${newRoomId}`);
//   };

//   const handleJoinRoom = () => {
//     if (!roomCode.trim()) {
//       alert("Please enter Room Code");
//       return;
//     }
//     navigate(`/room/${roomCode}`);
//   };

//   return (
//     <div className="homediv">
//       <div className="homedivchild">
//         <h2
//           style={{
//             backgroundColor: "#a9d6e8",
//             padding: "0px 20px",
//             marginTop: "0px",
//             borderRadius: "9px",
//           }}
//         >
//           Create New WhiteBoard
//         </h2>

//         <p style={{ margin: "50px 20px " }}>
//           only host can have permissions to create the room with whiteboard
//         </p>

//         <button
//           style={{ margin: "40px 80px", fontSize: "20px" }}
//           onClick={handleCreateRoom}
//         >
//           Create Room
//         </button>
//       </div>

//       <div className="homedivchild">
//         <h2
//           style={{
//             backgroundColor: "#a9d6e8",
//             padding: "0px 60px",
//             marginTop: "0px",
//             borderRadius: "9px",
//           }}
//         >
//           Join The Room
//         </h2>

//         <p style={{ margin: "50px 20px " }}>
//           any user can join the live room using the room code .it is mandatory
//           to know the room code.
//         </p>

//         <input
//           type="text"
//           placeholder="Room code.."
//           style={{ margin: "0px 20px", fontSize: "20px" }}
//           value={roomCode}
//           onChange={(e) => setRoomCode(e.target.value)}
//         />

//         <button
//           style={{ margin: "10px 120px", fontSize: "20px" }}
//           onClick={handleJoinRoom}
//         >
//           Join
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Home;

