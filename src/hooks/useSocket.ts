import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

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

<<<<<<< HEAD
=======
/** Join the driver's personal room so they receive qr:result events */
>>>>>>> a4055be (V2.1.1 : Fronted changes)
export const joinDriverRoom = (driverId: number) => {
  const socket = getSocket();
  socket.emit('driver:join', { driverId });
};

<<<<<<< HEAD
=======
/** Emit driver GPS location; server rebroadcasts as bus:moved */
>>>>>>> a4055be (V2.1.1 : Fronted changes)
export const emitLocation = (busId: number, lat: number, lng: number, routeId: number) => {
  const socket = getSocket();
  socket.emit('driver:location', { busId, lat, lng, routeId });
};

<<<<<<< HEAD
=======
/** Hook: subscribe to a socket event, auto-cleanup on unmount */
>>>>>>> a4055be (V2.1.1 : Fronted changes)
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
