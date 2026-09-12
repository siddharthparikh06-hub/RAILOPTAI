'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, RefreshCw } from 'lucide-react';
import { queryCopilot } from '../services/api';

export default function Copilot() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'copilot',
      text: "Namaste! I am RailOpt Copilot, your AI Operations Assistant. Ask me questions about maintenance schedules, joint block selections, downtime savings, or corridor risk factors.",
      badge: "AI DEMO RESPONSE"
    }
  ]);

  const samplePrompts = [
    "Why was Block B-113 selected?",
    "Which critical tasks are unscheduled?",
    "Which departments can share a block?",
    "Which section has the highest risk?",
    "How much downtime was saved?"
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await queryCopilot(q);
      setMessages((prev) => [...prev, { sender: 'copilot', text: res.answer, badge: res.badge }]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'copilot', text: "Combining Engineering, Traction and S&T into Block B-113 saves 126.5 hours of corridor downtime.", badge: "AI DEMO RESPONSE" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 h-[550px] flex flex-col justify-between shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-white text-base">RailOpt Copilot</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          AI DEMO RESPONSE
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 my-3 pr-2">
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`flex items-start space-x-2 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'copilot' && (
                <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-md">
                  RO
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-lg leading-relaxed shadow-lg ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium'
                    : 'bg-slate-950/80 border border-slate-800/80 text-slate-200 rounded-tl-none font-mono'
                }`}
              >
                {m.badge && (
                  <div className="text-[9px] font-mono font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{m.badge}</span>
                  </div>
                )}
                <p>{m.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
            <span>Querying operational data &amp; optimization model...</span>
          </motion.div>
        )}
      </div>

      {/* Suggested Prompts & Input Form */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          {samplePrompts.map((prompt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 hover:border-blue-500/60 text-slate-300 transition-colors shadow-sm"
            >
              {prompt}
            </motion.button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask questions about maintenance and block planning..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono shadow-inner"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
