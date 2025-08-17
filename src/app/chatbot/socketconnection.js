import { useState, useEffect } from 'react';

export default function useWebSocket() {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const username = 'user_' + Math.random().toString(36).substr(2, 9);
  const url = 'wss://echo.websocket.org'; // Replace with your WebSocket server URL
  useEffect(() => {
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = () => {
      setMessages((prev) => [...prev, { user: 'System', message: 'Connected to WebSocket server', pathaction: '', actionButton: '', msgType: 'text' }]);
    };

    websocket.onmessage = (event) => {
      let response;
      try {
        response = JSON.parse(event.data);
        response = response.customer ? {
          user: response.customer.user,
          message: response.customer.message,
          pathaction: response.customer.cmd || '',
          actionButton: response.customer.cmd ? `trigger_${response.customer.cmd.replace('/', '')}` : '',
          msgType: 'text'
        } : response;
      } catch (e) {
        response = { user: 'Server', message: event.data, pathaction: '', actionButton: '', msgType: 'text' };
      }

      setMessages((prev) => [...prev, response]);

      // Simulate bot responses
      if (response.pathaction === '/productpage') {
        sendBotResponse(websocket, 'Bot', 'Navigating to product page...', '/productpage', 'viewProducts');
      } else if (response.pathaction === '/login') {
        sendBotResponse(websocket, 'Bot', 'Please log in to continue.', '/login', 'openLogin');
      } else {
        sendBotResponse(websocket, 'Bot', `Echo: ${response.message}`, '', '');
      }
    };

    websocket.onclose = () => {
      setMessages((prev) => [...prev, { user: 'System', message: 'Disconnected from WebSocket server', pathaction: '', actionButton: '', msgType: 'text' }]);
    };

    websocket.onerror = (error) => {
      setMessages((prev) => [...prev, { user: 'System', message: `WebSocket error: ${error}`, pathaction: '', actionButton: '', msgType: 'text' }]);
    };

    return () => websocket.close();
  }, [url]);

  const sendMessage = (message) => {
    if (message.trim() && ws) {
      const isCommand = message.startsWith('/');
      const customerMessage = {
        customer: {
          user: username,
          message,
          cmd: isCommand ? message : undefined
        }
      };
      ws.send(JSON.stringify(customerMessage));
      setMessages((prev) => [...prev, { user: username, message, pathaction: isCommand ? message : '', actionButton: '', msgType: 'text' }]);
    }
  };

  const sendBotResponse = (websocket, user, message, pathaction, actionButton) => {
    const botMessage = {
      user,
      message,
      pathaction,
      actionButton,
      msgType: 'text'
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return { messages, sendMessage, username };
}