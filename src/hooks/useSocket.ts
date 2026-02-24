import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

let globalSocket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!globalSocket) {
    globalSocket = io(SOCKET_URL, { transports: ['websocket'] });
  }
  return globalSocket;
};

export const disconnectSocket = () => {
  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }
};

export const joinDriverRoom = (driverId: number) => {
  const socket = getSocket();
  socket.emit('driver:join', { driverId });
};

export const emitLocation = (busId: number, lat: number, lng: number, routeId: number) => {
  const socket = getSocket();
  socket.emit('driver:location', { busId, lat, lng, routeId });
};

export const useSocketEvent = <T>(event: string, handler: (data: T) => void) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();
    const fn = (data: T) => handlerRef.current(data);
    socket.on(event, fn);
    return () => { socket.off(event, fn); };
  }, [event]);
};
