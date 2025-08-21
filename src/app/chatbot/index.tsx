'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Send, X, HelpCircle, ShoppingCart, Contact, Package, MessageCircleMore, Minimize2, Paperclip, Mic, History, Pause } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock WebSocket hook for demo
const useWebSocket = () => {
  const [messages, setMessages] = useState([
    { user: 'Bot', message: 'Hello! I\'m here to help. Try typing @Help to see available commands.' }
  ]);
  
  const sendMessage = (message) => {
    setMessages(prev => [
      ...prev,
      { user: 'User', message },
      { user: 'Bot', message: `You sent: ${message}` }
    ]);
  };
  
  return { messages, sendMessage };
};

// Command list with associated icons
const commands = [
  { command: '@Help', description: 'Show all available commands', icon: HelpCircle },
  { command: '@ProductPage', description: 'Go to product page', icon: Package },
  { command: '@Cart', description: 'View shopping cart', icon: ShoppingCart },
  { command: '@Contact', description: 'Contact support', icon: Contact },
];

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentInputs, setRecentInputs] = useState([]);
  const { messages, sendMessage } = useWebSocket();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showCommands, setShowCommands] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(commands);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [activeTab, setActiveTab] = useState('chat');

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // Setup speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const handleVoiceInput = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    sendMessage(trimmedInput);
    setRecentInputs((prev) => {
      const newInputs = [trimmedInput, ...prev].slice(0, 10); // Keep last 10 inputs
      return newInputs;
    });
    setInput('');
    setShowCommands(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === ' ') {
      setInput((prev) => prev + ' ');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.startsWith('@')) {
      const search = value.slice(1);
      const filtered = commands.filter(
        (cmd) =>
          cmd.command.toLowerCase().startsWith('@' + search.toLowerCase()) ||
          cmd.description.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCommands(filtered);
      setShowCommands(filtered.length > 0);
    } else {
      setShowCommands(false);
    }
  };

  const selectCommand = (command) => {
    setInput(command + ' ');
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mock sending file - in real app, upload and send URL or something
      sendMessage(`Attached file: ${file.name}`);
    }
  };

  const highlightMessage = (message) => {
    const command = commands.find((cmd) => cmd.command === message);
    if (command) {
      return <span className="font-semibold text-emerald-600">{command.command}</span>;
    }
    return message;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed z-[9999] w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group',
          // Desktop positioning
          'bottom-4 right-4',
          // Mobile positioning - centered at bottom
          'sm:bottom-4 sm:right-4',
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'
        )}
        aria-label="Open chat"
      >
        <MessageCircleMore className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed z-[9998] transition-all duration-300 ease-out',
          // Mobile: Full screen with padding
          'inset-0 p-4 sm:inset-auto',
          // Desktop: Bottom right positioning with max width
          'sm:bottom-4 sm:right-4 sm:w-full sm:max-w-sm sm:p-0',
          isOpen 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-2 pointer-events-none'
        )}
      >
        <div className={cn(
          'bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50 backdrop-blur-sm',
          // Mobile: Full height with flex layout
          'h-full flex flex-col sm:h-auto sm:max-h-[700px] sm:block'
        )}>
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircleMore className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Chat Assistant</h3>
                  <p className="text-xs text-emerald-100">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors sm:block"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={cn(
                'flex-1 py-2 flex items-center justify-center text-sm font-medium transition-colors',
                activeTab === 'chat' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-600 hover:text-emerald-500'
              )}
            >
              <MessageCircleMore className="w-4 h-4 mr-2" />
              Chat Assistant
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                'flex-1 py-2 flex items-center justify-center text-sm font-medium transition-colors',
                activeTab === 'history' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-600 hover:text-emerald-500'
              )}
            >
              <History className="w-4 h-4 mr-2" />
              Recent Messages
            </button>
          </div>

          {/* Content Area */}
          {activeTab === 'chat' ? (
            <>
              {/* Messages Area */}
              <div className={cn(
                'overflow-y-auto px-3 py-4 space-y-4 bg-gray-50/30 flex-1 sm:flex-none sm:h-80'
              )}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex',
                      msg.user === 'Bot' ? 'justify-start' : 'justify-end'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed',
                        msg.user === 'Bot'
                          ? 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-md'
                      )}
                    >
                      {highlightMessage(msg.message)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Command Suggestions */}
              {showCommands && filteredCommands.length > 0 && (
                <div className="mx-3 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[9997] flex-shrink-0">
                  {filteredCommands.map((cmd, index) => (
                    <button
                      key={index}
                      onClick={() => selectCommand(cmd.command)}
                      className="w-full px-3 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <cmd.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-900">{cmd.command}</span>
                        <p className="text-xs text-gray-500">{cmd.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area - Grok-like Style */}
              <div className="p-3 border-t border-gray-200/50 flex-shrink-0">
                <div className="relative bg-white border border-gray-300 rounded-2xl shadow-sm hover:border-gray-400 transition-all">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder={isRecording ? 'Listening...' : 'Type @Help for commands or ask anything...'}
                    className="w-full resize-none outline-none bg-transparent px-4 py-3 text-sm text-gray-900 min-h-[65px] max-h-[120px] pl-12 pr-12"
                    rows={1}
                    style={{ 
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      whiteSpace: 'pre-wrap',
                    }}
                  />
                  {/* Attachment Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="absolute left-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-emerald-500 transition-colors"
                        aria-label="Attach file"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={handleFileAttach}>
                        Upload from local device
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {/* Voice/Send Button */}
                  <button
                    onClick={input.trim() ? handleSend : handleVoiceInput}
                    className={cn(
                      'absolute right-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                      input.trim() || isRecording
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md'
                        : 'bg-white text-gray-500 hover:text-emerald-500'
                    )}
                    aria-label={input.trim() ? 'Send message' : 'Voice input'}
                  >
                    {input.trim() ? (
                      <Send className="w-4 h-4" />
                    ) : isRecording ? (
                      <Pause className={cn('w-4 h-4 animate-pulse')} />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
           
            <div className={cn(
              'overflow-y-auto px-3 py-4 space-y-4 bg-gray-50/30 flex-1 sm:flex-none sm:h-80'
            )}>
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">No recent messages yet.</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex',
                      msg.user === 'Bot' ? 'justify-start' : 'justify-end'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed',
                        msg.user === 'Bot'
                          ? 'bg-gray-100 text-gray-800 rounded-bl-md'
                          : 'bg-emerald-100 text-emerald-800 rounded-br-md'
                      )}
                    >
                      <span className="font-bold">{msg.user}: </span>
                      {highlightMessage(msg.message)}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}