import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const onClick = (event:React.MouseEvent<HTMLAnchorElement>) => (!name || !room) ? event.preventDefault() : null;

    return (
        <div className="joinOuterContainer" >
            <div className="joinInnerContainer">
                <h1 className="heading">Join Chat</h1>
                <div><input placeholder="Your name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} /></div>
                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
                <Link onClick={onClick} to={`/chat?name=${name}&room=${room}`}>
                    <button className="button mt-20" type="submit">Go</button>
                </Link>
            </div>
        </div>
    );
};

export default Join;