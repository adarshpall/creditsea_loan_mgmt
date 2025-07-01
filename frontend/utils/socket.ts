let socket: WebSocket;

export const connect = (onMessage: (data: any) => void) => {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  socket = new WebSocket('ws://localhost:8000');

  socket.onopen = () => {
    console.log('✅ WebSocket connected');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onclose = () => {
    console.warn('⚠️ WebSocket disconnected');
  };

  socket.onerror = (err) => {
    console.error('❌ WebSocket error:', err);
  };
};

export const sendViaSocket = (data: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn('⚠️ Cannot send: WebSocket not connected');
  }
};
