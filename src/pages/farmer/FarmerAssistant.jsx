import React, { useState, useEffect, useRef } from 'react';
import { assistantService } from '../../services/assistantService';
import { Bot, Send, User, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

const FarmerAssistant = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const data = await assistantService.getConversations();
      setConversations(data);
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const data = await assistantService.getMessages(convId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputQuestion.trim() || sending) return;

    const currentQuestion = inputQuestion.trim();
    setInputQuestion('');
    setSending(true);

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'USER', messageText: currentQuestion, createdAt: new Date().toISOString() },
    ]);

    try {
      const response = await assistantService.askQuestion(currentQuestion, activeConversationId);
      if (!activeConversationId && response.conversationId) {
        setActiveConversationId(response.conversationId);
        fetchConversations();
      }
      setMessages((prev) => [
        ...prev,
        {
          id: response.messageId,
          sender: 'ASSISTANT',
          messageText: response.messageText,
          sourcesUsed: response.sourcesUsed,
          createdAt: response.createdAt,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ASSISTANT',
          messageText: 'Sorry, I encountered an issue processing your query. Please try again.',
          sourcesUsed: null,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-4 bg-slate-900/60 rounded-3xl border border-slate-800 p-4 overflow-hidden">
      <div className="w-full md:w-72 bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
        <div>
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-950 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ New AI Conversation</span>
          </button>

          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Saved Chat Sessions</p>

          <div className="space-y-1 overflow-y-auto max-h-96 pr-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 truncate ${
                  activeConversationId === conv.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{conv.title || `Chat #${conv.id}`}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-300 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> RAG Knowledge Search
          </p>
          <p className="mt-1 leading-relaxed">Retrieves context from verified ICAR, soil chemistry, and crop manuals.</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-950/90 rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/60">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AgriNexus AI RAG Assistant <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/50">Online</span>
            </h3>
            <p className="text-xs text-slate-400">Retrieval-Augmented Farming Intelligence Engine</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <Bot className="w-10 h-10" />
              </div>
              <h4 className="text-base font-bold text-white">How can I assist your farm today?</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Ask about crop rotation, nitrogen top-dressing, leaf blight treatments, or ideal soil pH for wheat.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ASSISTANT' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                }`}>
                  <p className="whitespace-pre-line">{msg.messageText}</p>
                  {msg.sourcesUsed && (
                    <div className="pt-2 border-t border-slate-800/80 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Sources: {msg.sourcesUsed}
                    </div>
                  )}
                </div>

                {msg.sender === 'USER' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {sending && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 animate-pulse">
                Retrieving agricultural knowledge chunks & generating response...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask AI Assistant about crops, soil pH, or pest remedies..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || sending}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerAssistant;

