import React, { FC, useState, useEffect } from 'react';
import queryString from 'query-string';
import { io, Socket } from 'socket.io-client';
import { RouteComponentProps } from 'react-router-dom';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket: Socket;
const ENDPOINT = process.env.REACT_APP_ENDPOINT ?? '';

const Chat: FC<RouteComponentProps> = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState<{ name: string }[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    if (typeof room !== 'string' || typeof name !== 'string') return;
    setRoom(room);
    setName(name);

    socket = io(ENDPOINT);
    socket.emit('join', { name, room }, (error: Error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.emit('disconnect');
    };
  }, [location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
