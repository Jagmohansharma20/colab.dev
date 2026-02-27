import { useParams, useLocation } from "react-router-dom";
import { FaUserCircle, FaPaintBrush } from "react-icons/fa";
import { BsFillEraserFill } from "react-icons/bs";
import { SiCcleaner } from "react-icons/si";
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaCircleUser } from "react-icons/fa6";


const socket = io("https://colab-dev.onrender.com");

function Room() {

  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name;

  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [color, setcolor] = useState("black");
  const [brushSize, setbrushSize] = useState(2);
  const [isEraser, setisEraser] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([]);

  // ================= SOCKET JOIN =================
  useEffect(() => {
    if (!roomId || !name) return;

    socket.emit("join-room", { roomId, name });

    socket.on("users-in-room", (usersList) => {
      setUsers(usersList);
    });

    return () => {
      socket.off("users-in-room");
    };

  }, [roomId, name]);

  // ================= CHAT =================
  const sendMessage = () => {
  if (!message.trim()) return;

  const newMessage = {
    text: message,
    time: new Date().toLocaleTimeString(),
    sender: name
  };

  // 🔥 Emit to server
  socket.emit("send-message", {
    roomId,
    message: newMessage
  });

  setMessage("");
};

useEffect(() => {

  socket.on("receive-message", (message) => {
    setMessages((prev) => [...prev, message]);
  });

  return () => {
    socket.off("receive-message");
  };

}, []);
  // const sendMessage = () => {
  //   if (!message.trim()) return;

  //   const newMessage = {
  //     text: message,
  //     time: new Date().toLocaleTimeString(),
  //     sender: name
  //   };

  //   setMessages((prev) => [...prev, newMessage]);
  //   setMessage("");
  // };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= CANVAS =================
  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //for clear board
    socket.emit("clear-board", { roomId });
  };

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let isDrawing = false;

    // const startDrawing = (e) => {
    //   isDrawing = true;
    //   ctx.beginPath();
    //   ctx.moveTo(e.offsetX, e.offsetY);
    // };

    const startDrawing = (e) => {
  isDrawing = true;

  const data = {
    x: e.offsetX,
    y: e.offsetY,
    color,
    brushSize,
    isEraser
  };

  socket.emit("start-drawing", { roomId, data });

  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
};

    //  
    
    const draw = (e) => {
  if (!isDrawing) return;

  const data = {
    x: e.offsetX,
    y: e.offsetY,
    color,
    brushSize,
    isEraser
  };

  socket.emit("draw", { roomId, data });

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = isEraser ? "white" : color;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

    // const stopDrawing = () => {
    //   isDrawing = false;
    //   ctx.beginPath();
    // };

    const stopDrawing = () => {
  isDrawing = false;
  socket.emit("stop-drawing", { roomId });
  ctx.beginPath();
};

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };

  }, [color, brushSize, isEraser]);

  //for whiteboard real time 
  
   useEffect(() => {

  socket.on("draw", (data) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = data.brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = data.isEraser ? "white" : data.color;

    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  });

  return () => {
    socket.off("draw");
  };

}, []);
  
  useEffect(() => {

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  socket.on("start-drawing", (data) => {
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
  });

  socket.on("draw", (data) => {
    ctx.lineWidth = data.brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = data.isEraser ? "white" : data.color;

    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  });

  socket.on("stop-drawing", () => {
    ctx.beginPath();
  });

  return () => {
    socket.off("start-drawing");
    socket.off("draw");
    socket.off("stop-drawing");
  };

}, []);

//for clearboard

useEffect(() => {

  socket.on("clear-board", () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  return () => {
    socket.off("clear-board");
  };

}, []);

  return (
    <>
      <div style={{ display: "flex" }}>
        <h2 className="roomid_h2">Room ID: {roomId}</h2>

        <div className="showusers" >
          {users.map((user) => (
            <div key={user.id}>
              <div class="users" >
                <FaUserCircle />
                <p style={{ marginTop: "0px" }}>{user.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="roomdiv">

        <div className="toolbardiv">
          <button onClick={() => { setcolor("black"); setisEraser(false); }} style={{ backgroundColor: "black", color: "white" }}>Black</button>
          <button onClick={() => { setcolor("red"); setisEraser(false); }} style={{ backgroundColor: "red", color: "white" }}>Red</button>
          <button onClick={() => { setcolor("blue"); setisEraser(false); }} style={{ backgroundColor: "blue", color: "white" }}>Blue</button>
          <button onClick={() => { setcolor("green"); setisEraser(false); }} style={{ backgroundColor: "green", color: "white" }}>Green</button>

          <p>Brush Size</p>
          <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setbrushSize(Number(e.target.value))} style={{ marginLeft: "-3px", width: "66px" }} />

          <button onClick={() => setisEraser(false)} style={{ border: "1px solid black", backgroundColor: '#a9d6e5' }}>
            <FaPaintBrush style={{ fontSize: "20px" }} />
          </button>

          <button onClick={() => setisEraser(true)} style={{ border: "1px solid black", backgroundColor: '#a9d6e5' }}>
            <BsFillEraserFill style={{ fontSize: "20px" }} />
          </button>

          <button onClick={clearBoard} style={{ border: "1px solid black", backgroundColor: '#a9d6e5' }}>
            <SiCcleaner style={{ fontSize: "20px" }} />
          </button>
        </div>

        <div className="whiteboarddiv">
          <canvas className="canvasdiv" ref={canvasRef} width="700" height="450" />
        </div>

        <div className="chatdiv">
          <h3 style={{ backgroundColor: "#574CD6", color: "white", marginTop: "0px", borderRadius: "11px", padding: "3px 120px", height: "34px" }}>Chat</h3>

          <div className="showmessagediv">
            {messages.map((msg, index) => (
              <div className="singlemessage" key={index} style={{ marginBottom: "8px" }}>
                <div >{msg.sender} : {msg.text}</div>
                <strong style={{ fontSize: "10px", paddingLeft: "200px" }}>{msg.time}</strong>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="message">
            <input
              type="text"
              placeholder="type message ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "220px", height: "23px" }}
            />
            <button onClick={sendMessage} style={{ marginLeft: "5px", height: "27px",backgroundColor:"#5652e3",color:"white",border:"1px solid white",borderRadius:"5px" }}>Send</button>
          </div>
        </div>

      </div>
    </>
  );
}

export default Room;







// import { useParams } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa";

// import { useRef, useEffect, useState } from "react";
// import { FaPaintBrush } from "react-icons/fa";
// import { BsFillEraserFill } from "react-icons/bs";
// import { SiCcleaner } from "react-icons/si";
// import { io } from "socket.io-client";
// const socket = io("http://localhost:3000");
// function Room() {

//   const { roomId } = useParams();
//   const canvasRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   const [color, setcolor] = useState("black");
//   const [brushSize, setbrushSize] = useState(2);
//   const [isEraser, setisEraser] = useState(false);

//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([{ text: "Hello", time: "10:25 PM" }, { text: "Hi", time: "10:26 PM" }]);

//   const [name, setName] = useState("");
//   const [users, setUsers] = useState([]);
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const newMessage = {
//       text: message,
//       time: new Date().toLocaleTimeString()
//     };
//     setMessages((prev) => [...prev, newMessage]);
//     setMessage("");

//   };

//   const clearBoard = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//   }


//   useEffect(() => {

//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let isDrawing = false;
//     const startDrawing = (e) => {
//       isDrawing = true;
//       ctx.beginPath();
//       ctx.moveTo(e.offsetX, e.offsetY);
//     }

//     const draw = (e) => {
//       if (!isDrawing) return;
//       ctx.lineWidth = brushSize;
//       ctx.lineCap = "round";
//       ctx.strokeStyle = isEraser ? "white" : color;
//       ctx.lineTo(e.offsetX, e.offsetY);
//       ctx.stroke();
//     }
//     const stopDrawing = () => {
//       isDrawing = false;
//       ctx.beginPath();
//     };

//     canvas.addEventListener("mousedown", startDrawing);
//     canvas.addEventListener("mousemove", draw);
//     canvas.addEventListener("mouseup", stopDrawing);
//     canvas.addEventListener("mouseleave", stopDrawing);
//     return () => {
//       canvas.removeEventListener("mousedown", startDrawing);
//       canvas.removeEventListener("mousemove", draw);
//       canvas.removeEventListener("mouseup", stopDrawing);
//       canvas.removeEventListener("mouseleave", stopDrawing);
//     };

//   }, [color, brushSize, isEraser]);


//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {

//     if (!roomId || !name) return;

//     socket.emit("join-room", { roomId, name });

//     socket.on("users-in-room", (usersList) => {
//       setUsers(usersList);
//     });

//     return () => {
//       socket.disconnect();
//     };

//   }, [roomId, name]);

//   return (
//     <>
//       <div style={{ display: "flex" }}>
//         <h2>Room ID: {roomId}</h2>
//         <div style={{ border: "1px solid black", width: "600px", margin: "1px 120px",display:"flex" }}>
          
//           {users.map((user) => (
//             <div key={user.id}>
//               <h3 style={{display:"flex" ,backgroundColor:"rgb(9, 148, 172)",width:"90px"}}><FaUserCircle/><p style={{marginTop:"0px"}}>{user.name}</p></h3>
             
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="roomdiv">
//         <div className="toolbardiv">
//           <button onClick={() => { setcolor("black"); setisEraser(false); }} style={{ backgroundColor: "black", color: 'white' }} >Black</button>
//           <button onClick={() => { setcolor("red"); setisEraser(false); }} style={{ backgroundColor: "red", color: 'white' }}>Red</button>
//           <button onClick={() => { setcolor("blue"); setisEraser(false); }} style={{ backgroundColor: "blue", color: 'white' }}>Blue</button>
//           <button onClick={() => { setcolor("green"); setisEraser(false); }} style={{ backgroundColor: "green", color: 'white' }}>Green</button>

//           <p>Brush Size</p>
//           <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setbrushSize(Number(e.target.value))} style={{ marginLeft: "-3px", width: "66px" }}></input>

//           <button onClick={() => { setisEraser(false); }} style={{ border: "1px solid black", backgroundColor: '#a9d6e5' }} ><FaPaintBrush style={{ fontSize: "20px" }} /></button>
//           <button onClick={() => { setisEraser(true); }} style={{ border: "1px solid black", backgroundColor: '#a9d6e5' }} > <BsFillEraserFill style={{ fontSize: "20px" }} /></button>
//           <button onClick={clearBoard} style={{ border: "1px solid black", backgroundColor: '#a9d6e5' }} > <SiCcleaner style={{ fontSize: "20px" }} /></button>
//         </div>

//         <div className="whiteboarddiv">
//           <canvas ref={canvasRef} width="700" height="450" style={{ border: "2px solid black", backgroundColor: "white" }} />
//         </div>

//         <div className="chatdiv">
//           <h3 style={{ backgroundColor: "#574CD6", color: "white", marginTop: "0px", borderRadius: "11px", padding: "3px 120px", height: "24px" }}>Chat</h3>
//           <div class='showmessagediv' >

//             <div >
//               {messages.map((msg, index) => (
//                 <div className="singlemessage" key={index} style={{ marginBottom: "8px" }}>
//                   <div>{msg.text}</div>
//                   <strong style={{ fontSize: "10px", paddingLeft: "200px" }}>{msg.time}</strong>
//                 </div>
//               ))}
//             </div>
//             <div ref={messagesEndRef}></div>
//           </div>
//           <div className="message">
//             <input type="text" placeholder="type message ..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: "220px", height: "23px" }} />
//             <button onClick={sendMessage} style={{ marginLeft: "5px", height: "27px" }}>Send</button>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Room;