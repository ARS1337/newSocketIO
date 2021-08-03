import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../utils/Socket';

function Child(props:{}) {
    const Context = useContext(SocketContext);
    const socket = Context.socket;
    const socketID = Context.socketID;
    const addToSocket = ()=>{
        // socket.auth
    }
    console.log(socketID,socket)
    useEffect(()=>{
        socket.emit('data',{gg:"noob"})
    },[])
    return (
        <div>
            Child
        </div>
    );
}

export default Child;