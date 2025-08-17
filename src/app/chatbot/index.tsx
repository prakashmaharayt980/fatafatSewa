'use client';

import { useState, useEffect, useRef } from 'react';
import useWebSocket from './socketconnection';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
// Add commands list
const commands = [
  { command: '/help', description: 'Show all available commands' },
  { command: '/productpage', description: 'Go to product page' },
  { command: '/cart', description: 'View shopping cart' },
  { command: '/contact', description: 'Contact support' },
];

export default function Index() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage } = useWebSocket();
  const messagesEndRef = useRef(null);
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(commands);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleInputChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    
    if (value.startsWith('/')) {
      const search = value.slice(1).toLowerCase();
      const filtered = commands.filter(cmd => 
        cmd.command.toLowerCase().includes(search) ||
        cmd.description.toLowerCase().includes(search)
      );
      setFilteredCommands(filtered);
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  };

  const selectCommand = (command) => {
    setInput(command);
    setShowCommands(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 right-4 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all',
          'transition-transform duration-300 ease-in-out transform',
          isOpen ? ' hidden' : 'scale-95'
        )}
      >
        💬
      </button>

      <div className={cn(
        `fixed md:w-96 bottom-20 right-4 z-40 transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`
      )}>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-4 bg-green-500 text-white flex justify-between items-center">
            <h3 className="font-bold">Chat Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-green-600 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="h-96 overflow-y-auto border-x border-gray-200 p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.user === 'Bot' ? 'pl-2' : 'pr-2'}`}>
                <div className={`p-3 rounded-lg ${
                  msg.user === 'Bot' 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-green-500 text-white ml-auto'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  {msg.pathaction && 
                    <span className="text-xs text-blue-500 block mt-1">
                      [Action: {msg.pathaction}]
                    </span>
                  }
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e)=>handleInputChange(e)}
                  onKeyDown={(e) => handleKeyPress(e)}
                  placeholder="Type / for commands or write a message..."
                  className="w-full p-3 min-h-[45px] max-h-[120px] border text-black border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-y"
                  rows={1}
                />
                {showCommands && (
                  <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                    {filteredCommands.map((cmd, index) => (
                      <button
                        key={index}
                        onClick={() => selectCommand(cmd.command)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex flex-col"
                      >
                        <span className="font-medium">{cmd.command}</span>
                        <span className="text-xs text-gray-500">{cmd.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleSend}
                className="h-[45px] px-5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}