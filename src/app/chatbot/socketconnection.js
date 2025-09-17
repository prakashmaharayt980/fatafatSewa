import { useState, useEffect } from "react";

export default function useWebhook() {
  const [messages, setMessages] = useState<any[]>([]);
  const username = "user_" + Math.random().toString(36).substr(2, 9);

  // Replace with your backend API that receives webhook events
  const webhookUrl = "https://gadgetcity.app.n8n.cloud/webhook-test/gadgetcity";

  useEffect(() => {
    setMessages((prev) => [
      ...prev,
      {
        user: "System",
        message: "Listening for webhook events...",
        pathaction: "",
        actionButton: "",
        msgType: "text",
      },
    ]);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(webhookUrl);
        if (!res.ok) return;
        const newEvents = await res.json();

        // append webhook events
        newEvents.forEach((event: any) => {
          setMessages((prev) => [...prev, event]);

          // simulate bot-like actions
          if (event.pathaction === "/productpage") {
            sendBotResponse("Bot", "Navigating to product page...", "/productpage", "viewProducts");
          } else if (event.pathaction === "/login") {
            sendBotResponse("Bot", "Please log in to continue.", "/login", "openLogin");
          }
        });
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { user: "System", message: `Error fetching webhook events: ${err}`, pathaction: "", actionButton: "", msgType: "text" },
        ]);
      }
    }, 3000); // poll every 3s

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (message: string) => {
    if (message.trim()) {
      const isCommand = message.startsWith("/");
      const customerMessage = {
        customer: {
          user: username,
          message,
          cmd: isCommand ? message : undefined,
        },
      };

      // POST to backend (instead of ws.send)
      await fetch(webhookUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerMessage),
      });

      setMessages((prev) => [
        ...prev,
        {
          user: username,
          message,
          pathaction: isCommand ? message : "",
          actionButton: "",
          msgType: "text",
        },
      ]);
    }
  };

  const sendBotResponse = (user: string, message: string, pathaction: string, actionButton: string) => {
    const botMessage = {
      user,
      message,
      pathaction,
      actionButton,
      msgType: "text",
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return { messages, sendMessage, username };
}
