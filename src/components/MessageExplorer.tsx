import React, { useState } from 'react';
import { TimeCategory } from '../types';
import {
  getAllMessagesForCategory,
  getCategoryBadgeInfo,
  getTotalMessageCount
} from '../utils/scheduledMessages';
import { Search, Sparkles } from 'lucide-react';

export function MessageExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<TimeCategory>('morning');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = getTotalMessageCount();
  const messages = getAllMessagesForCategory(selectedCategory);

  const filteredMessages = messages.filter((m) =>
    m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: { key: TimeCategory; label: string; count: number; emoji: string }[] = [
    { key: 'morning', label: 'Morning Boot', count: counts.morning, emoji: '☀️' },
    { key: 'afternoon', label: 'Afternoon Process', count: counts.afternoon, emoji: '🍱' },
    { key: 'evening', label: 'Evening Build', count: counts.evening, emoji: '🔥' },
    { key: 'night', label: 'Night Mode', count: counts.night, emoji: '🌙' },
  ];

  const currentBadge = getCategoryBadgeInfo(selectedCategory);

  return (
    <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h3 className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <span>TerminalSoul Message Corpus</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              505 Unique Messages
            </span>
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            Zero overlap with Office Leave Timer V1 • Four distinct workday shift pools
          </p>
        </div>

        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jokes & punchlines..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category selector tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`p-3 rounded-2xl border text-left font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#151a25] border-indigo-500/50 shadow-md shadow-indigo-900/20'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="text-lg mb-1">{cat.emoji}</div>
              <div className="text-xs font-bold text-white">{cat.label}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{cat.count} Messages</div>
            </button>
          );
        })}
      </div>

      {/* Messages Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-white/50 px-1">
          <span>
            Showing {filteredMessages.length} of {messages.length} {selectedCategory} messages
          </span>
          <span className="text-indigo-400 font-bold">Deterministic Hash: Date + Shift</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {filteredMessages.slice(0, 40).map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-2xl bg-[#11141c] border border-white/5 space-y-2 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 font-bold">
                  #{msg.id.toString().padStart(3, '0')}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentBadge.bgColor} ${currentBadge.textColor} ${currentBadge.borderColor} uppercase`}
                >
                  {selectedCategory}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-200 whitespace-pre-line leading-relaxed">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
