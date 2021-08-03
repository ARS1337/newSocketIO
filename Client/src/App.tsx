import React, { useEffect, useState } from 'react';
import { SocketContext, socket } from './utils/Socket';
import Child from './components/Child';

function App() {
  const [connected, setConnected] = useState(false);
  const [socketID, setSocketID] = useState('');
  useEffect(() => {
    socket.connect();
    socket.on('join', (data: { socketID: string }) => {
      console.log("msg received", data.socketID)
      setConnected(socket.connected);
      setSocketID(data.socketID);
      
    })
  }, [])
  return (
    <SocketContext.Provider value={{socket:socket,socketID:socketID}}>
      Connected: {connected ? "true" : "false"}<br />
      socketID: {socketID}
      <Child />
    </SocketContext.Provider>
  );
}

export default App;
