import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Send, Paperclip, Search } from 'lucide-react';

export default function Messaging() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState('');

  // Mock data - Replace with real data from your backend
  const conversations = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Thanks for your application',
      timestamp: '2h ago',
      unread: true,
    },
    {
      id: '2',
      name: 'Tech Corp',
      lastMessage: 'When are you available for an interview?',
      timestamp: '1d ago',
      unread: false,
    },
  ];

  const messages = [
    {
      id: '1',
      sender: 'them',
      content: 'Hi, thanks for applying to our position.',
      timestamp: '10:00 AM',
    },
    {
      id: '2',
      sender: 'me',
      content: 'Thank you for considering my application!',
      timestamp: '10:05 AM',
    },
    {
      id: '3',
      sender: 'them',
      content: 'Would you be available for an interview next week?',
      timestamp: '10:10 AM',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add message sending logic here
    setMessage('');
  };

  return (
    <div className="h-screen flex">
      {/* Conversation List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 flex items-center ${
                selectedConversation === conversation.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                {conversation.name.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{conversation.name}</h3>
                  <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unread && (
                <div className="ml-2 h-2 w-2 bg-indigo-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {conversations.find(c => c.id === selectedConversation)?.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {conversations.find(c => c.id === selectedConversation)?.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'me'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'me' ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border-0 focus:ring-0 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}