import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../utils/Socket';

function Child(props) {
    const socket = useContext(SocketContext);
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