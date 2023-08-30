// import React, { useState, useEffect, useRef } from 'react';

// const DataDisplay = () => {
//   const [data, setData] = useState([]);
//   const socketRef = useRef(null);

//   useEffect(() => {
//     // Create a new WebSocket connection
//     socketRef.current = new WebSocket('ws://localhost:3001');

//     // Event handler for when the connection is opened
//     socketRef.current.onopen = () => {
//       console.log('WebSocket connection opened');
//     };

//     // Event handler for receiving messages
//     socketRef.current.onmessage = (event) => {
//       console.log('Received data:', event.data);
//       try {
//         const receivedData = event.data.split('|');
//         const newData = receivedData.map((item) => JSON.parse(item));
//         setData((prevData) => [...prevData, ...newData]);
//       } catch (error) {
//         console.error('Error parsing received data:', error);
//       }
//     };

//     // Event handler for when the connection is closed
//     socketRef.current.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     // Event handler for errors
//     socketRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     // Clean up: Close the WebSocket connection when the component unmounts
//     return () => {
//       if (socketRef.current.readyState === WebSocket.OPEN) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div className="data-container">
//       <h1>Encrypted Timeseries Data</h1>
//       <table className="data-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Origin</th>
//             <th>Destination</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.name}</td>
//               <td>{item.origin}</td>
//               <td>{item.destination}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DataDisplay;


import React, { useEffect, useState } from 'react';
import { Manager } from 'socket.io-client';

const manager = new Manager("localhost:3001");
const socket = manager.socket("/"); // main namespace

socket.on("connect", () => { 
    console.log('Frontend connected');
});

socket.on("disconnect", (reason) => {
    console.log('Frontend disconnected: ' + reason);
});

socket.on('messageSaved', (msgs) => {
    console.log(msgs);
});

const DataDisplay = () => {
  const [messages, setMessages] = useState([]);
  const [successRate, setSuccessRate] = useState(0);

  socket.on('messageSaved', (msgs) => {
    console.log(msgs);
    // setMessages((prevMessages) => [...prevMessages, ...msgs]);
    setMessages(msgs);
    // Calculate and update success rate
    const newSuccessRate = (messages.length + 1) / (messages.length + 1 + 1); // +1 for the new message
    setSuccessRate(newSuccessRate);
  });

  useEffect(() => {
  }, [messages]);

  return (
    <div>
      <h1>Real-Time Data</h1>
      <p>Success Rate: {Math.round(successRate * 100)}%</p>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{JSON.stringify(message)}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataDisplay;
