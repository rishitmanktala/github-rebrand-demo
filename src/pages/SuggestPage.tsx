import React, { useState } from 'react';
import { useAppStore } from '../store';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Send, ArrowLeft } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'copilot';
}

function ClassicSuggest() {
  const { owner, repo } = useParams();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: `What would you like to change in ${owner}/${repo}?`, sender: 'copilot' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    setInputValue('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Looking into it...', sender: 'copilot' }]);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-classic flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6 border-b border-gray-800 pb-4">
        <Link to={`/${owner}/${repo}`} className="text-blue-400 hover:underline flex items-center text-sm">
          <ArrowLeft size={14} className="mr-1" /> Back to {repo}
        </Link>
        <h1 className="text-2xl font-semibold text-white mt-4">Suggest a Change with Copilot</h1>
      </div>

      <div className="flex-1 overflow-y-auto border border-gray-700 rounded-md bg-[#0d1117] p-4 flex flex-col space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-md text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-[#161b22] border border-gray-700 text-gray-300'}`}>
              {msg.sender === 'copilot' && <strong className="block text-white mb-1 flex items-center"><Sparkles size={14} className="mr-1"/> Copilot</strong>}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe your change..."
          className="flex-1 bg-[#161b22] border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-code text-sm"
        />
        <button type="submit" className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function StudioSuggest() {
  const { owner, repo } = useParams();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: `What would you like to change in ${owner}/${repo}?`, sender: 'copilot' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    setInputValue('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Looking into it...', sender: 'copilot' }]);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-people studio-texture flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            <Link to={`/${owner}/${repo}`} className="hover:text-ink">{owner} / {repo}</Link>
          </div>
          <h1 className="text-5xl font-display font-black tracking-tight uppercase text-ink flex items-center">
            <Sparkles size={36} className="text-ai-blue mr-3" /> Workshop Copilot
          </h1>
        </div>
        <Link to={`/${owner}/${repo}`} className="bg-white border-2 border-ink text-ink font-bold uppercase text-xs px-4 py-2 hover:bg-gray-100">
          Cancel
        </Link>
      </div>

      <div className="flex-1 bg-white border-2 border-ink shadow-[8px_8px_0px_0px_rgba(10,10,10,1)] flex flex-col overflow-hidden mb-6">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'copilot' && (
                <div className="w-10 h-10 rounded-full border-2 border-ink bg-ai-blue text-white flex items-center justify-center mr-3 shrink-0">
                  <Sparkles size={18} />
                </div>
              )}
              <div className={`p-4 border-2 border-ink text-lg ${msg.sender === 'user' ? 'bg-highlight-yellow text-ink shadow-[2px_2px_0px_0px_rgba(10,10,10,1)]' : 'bg-blue-50 text-blue-900 shadow-[2px_2px_0px_0px_rgba(88,166,255,1)]'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t-2 border-ink bg-gray-50">
          <form onSubmit={handleSubmit} className="flex relative">
            <input 
              type="text" 
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe what you want to build or change..."
              className="flex-1 border-2 border-ink bg-white px-4 py-4 text-xl font-display font-bold text-ink placeholder-gray-400 outline-none pr-16"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-ink text-white px-4 flex items-center justify-center hover:bg-gray-800 transition">
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SuggestPage() {
  const { lens } = useAppStore();
  return lens === 'classic' ? <ClassicSuggest /> : <StudioSuggest />;
}
