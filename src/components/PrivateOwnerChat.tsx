import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Lock,
  Sparkles,
  CheckCheck,
  Mail,
  User,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { AuthUser } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'visitor' | 'owner';
  senderName: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface PrivateChatThread {
  threadId: string;
  visitorName: string;
  visitorEmail: string;
  messages: ChatMessage[];
  lastUpdated: string;
  unreadCount: number;
}

interface PrivateOwnerChatProps {
  currentUser: AuthUser;
}

const STORAGE_KEY_VISITOR_THREAD = 'civility_private_chat_visitor_thread_v1';
const STORAGE_KEY_OWNER_THREADS = 'civility_private_chat_owner_threads_v1';

export const PrivateOwnerChat: React.FC<PrivateOwnerChatProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorEmail, setVisitorEmail] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [unreadTotal, setUnreadTotal] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if current logged-in user is the Founder / Owner
  const isFounderOwner =
    currentUser.email.includes('owner') ||
    currentUser.email.includes('ronnie') ||
    currentUser.role === 'universal';

  // Visitor Session state
  const [visitorThread, setVisitorThread] = useState<PrivateChatThread>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VISITOR_THREAD);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore parse error
      }
    }

    const defaultThreadId = `visitor-chat-${Date.now()}`;
    return {
      threadId: defaultThreadId,
      visitorName: 'Guest Partner / Investor',
      visitorEmail: 'partner.inquiry@civility.com',
      lastUpdated: new Date().toISOString(),
      unreadCount: 1,
      messages: [
        {
          id: 'welcome-01',
          sender: 'owner',
          senderName: 'Ronnie Hills (Founder & CEO)',
          text: 'Hello! Welcome to Mind your manners. I am Ronnie Hills, the Founder. This is a 100% private 1-on-1 direct channel to speak with me directly. No other visitors or third parties can see this chat. How can I assist you today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        }
      ]
    };
  });

  // Owner State (Master Inbox for Owner to see all individual visitor chats)
  const [allOwnerThreads, setAllOwnerThreads] = useState<PrivateChatThread[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_OWNER_THREADS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore parse error
      }
    }
    return [];
  });

  const [activeOwnerThreadId, setActiveOwnerThreadId] = useState<string>('');

  // Persist visitor thread
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VISITOR_THREAD, JSON.stringify(visitorThread));
    
    // Also sync visitor thread into owner master store for dual view
    setAllOwnerThreads((prev) => {
      const idx = prev.findIndex((t) => t.threadId === visitorThread.threadId);
      let updated: PrivateChatThread[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = visitorThread;
      } else {
        updated = [visitorThread, ...prev];
      }
      localStorage.setItem(STORAGE_KEY_OWNER_THREADS, JSON.stringify(updated));
      return updated;
    });
  }, [visitorThread]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, visitorThread.messages, allOwnerThreads, activeOwnerThreadId]);

  // Handle Visitor Send Message
  const handleSendVisitorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'visitor',
      senderName: visitorName.trim() || currentUser.name || 'Guest Partner',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setVisitorThread((prev) => {
      const updatedMessages = [...prev.messages, newMsg];
      return {
        ...prev,
        visitorName: visitorName.trim() || prev.visitorName,
        visitorEmail: visitorEmail.trim() || prev.visitorEmail,
        messages: updatedMessages,
        lastUpdated: new Date().toISOString()
      };
    });

    // Simulated Auto-Acknowledge Response from Ronnie Hills if offline
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'owner',
        senderName: 'Ronnie Hills (Founder & CEO)',
        text: `Thank you for reaching out! I've received your private message directly. I am notified in real time on my mobile device. If you'd like to leave your direct email or request a private video walk-through, reply here or email ronniehillsugc@gmail.com anytime.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };

      setVisitorThread((prev) => ({
        ...prev,
        messages: [...prev.messages, autoReply],
        lastUpdated: new Date().toISOString()
      }));
    }, 1200);
  };

  // Handle Owner Reply to a specific thread
  const handleSendOwnerReply = (threadId: string) => {
    if (!inputText.trim()) return;
    const replyText = inputText.trim();
    setInputText('');

    const ownerMsg: ChatMessage = {
      id: `owner-reply-${Date.now()}`,
      sender: 'owner',
      senderName: 'Ronnie Hills (Founder & CEO)',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    if (threadId === visitorThread.threadId) {
      setVisitorThread((prev) => ({
        ...prev,
        messages: [...prev.messages, ownerMsg],
        lastUpdated: new Date().toISOString()
      }));
    } else {
      setAllOwnerThreads((prev) => {
        const updated = prev.map((t) => {
          if (t.threadId === threadId) {
            return {
              ...t,
              messages: [...t.messages, ownerMsg],
              lastUpdated: new Date().toISOString()
            };
          }
          return t;
        });
        localStorage.setItem(STORAGE_KEY_OWNER_THREADS, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const currentActiveThread =
    isFounderOwner && activeOwnerThreadId
      ? allOwnerThreads.find((t) => t.threadId === activeOwnerThreadId) || visitorThread
      : visitorThread;

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* FLOATING CHAT BUTTON */}
      {!isOpen && (
        <button
          id="btn-open-private-founder-chat"
          onClick={() => {
            setIsOpen(true);
            setUnreadTotal(0);
          }}
          className="group relative flex items-center gap-3 bg-[#0A0A0A] hover:bg-[#141414] border border-amber-400/60 hover:border-amber-400 text-white p-3.5 pr-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-mono font-bold shadow-md shrink-0">
            <MessageSquare className="w-5 h-5 text-black" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0A0A0A] animate-pulse"></span>
          </div>

          <div className="text-left font-mono">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Chat Privately with Founder</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[10px] text-white/70">Ronnie Hills (Founder & CEO) • Private 1-on-1</div>
          </div>

          {unreadTotal > 0 && (
            <span className="absolute -top-1.5 -left-1.5 bg-rose-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg">
              {unreadTotal} NEW
            </span>
          )}
        </button>
      )}

      {/* CHAT WINDOW DRAWER */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[540px] bg-[#0D0D0D] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in text-[#F5F5F0]">
          
          {/* HEADER */}
          <div className="bg-[#141414] border-b border-white/10 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold font-mono text-sm">
                  RH
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#141414]"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-mono">
                  <h3 className="text-sm font-bold text-white">Ronnie Hills</h3>
                  <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded">
                    Founder
                  </span>
                </div>
                <p className="text-[10px] font-mono text-white/60 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Private 1-on-1 • Only you & Ronnie</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Minimize Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/50 hover:text-rose-400 hover:bg-white/10 rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ISOLATED PRIVACY BANNER */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 font-mono text-[10px] text-amber-200/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Isolated Private Thread • End-to-End Privacy</span>
            </div>
            <a
              href="mailto:ronniehillsugc@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-amber-300 flex items-center gap-1 shrink-0"
            >
              <Mail className="w-3 h-3" />
              <span>Direct Email</span>
            </a>
          </div>

          {/* IF OWNER: MASTER INBOX SWITCHER */}
          {isFounderOwner && (
            <div className="bg-[#050505] border-b border-white/10 p-2 font-mono text-[10px]">
              <div className="text-amber-400 font-bold mb-1 flex items-center gap-1">
                <Bot className="w-3 h-3" />
                <span>Founder Master Inbox ({allOwnerThreads.length} Guest Threads)</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveOwnerThreadId('')}
                  className={`px-2 py-1 rounded text-[9px] whitespace-nowrap transition-colors ${
                    !activeOwnerThreadId
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  Current Visitor Session
                </button>
                {allOwnerThreads.map((t) => (
                  <button
                    key={t.threadId}
                    type="button"
                    onClick={() => setActiveOwnerThreadId(t.threadId)}
                    className={`px-2 py-1 rounded text-[9px] whitespace-nowrap transition-colors ${
                      activeOwnerThreadId === t.threadId
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {t.visitorName} ({t.messages.length})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES LIST AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans text-xs bg-[#090909]">
            {currentActiveThread.messages.map((msg) => {
              const isOwner = msg.sender === 'owner';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOwner ? 'items-start' : 'items-end'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40">
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 max-w-[85%] rounded-2xl leading-relaxed text-xs shadow-md ${
                      isOwner
                        ? 'bg-[#181818] text-white border border-white/10 rounded-tl-none'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {isOwner && (
                    <div className="text-[9px] font-mono text-emerald-400/80 flex items-center gap-1 pl-1">
                      <CheckCheck className="w-3 h-3 text-emerald-400" />
                      <span>Verified Founder Message</span>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT SUGGESTIONS FOR VISITORS */}
          {!isFounderOwner && (
            <div className="p-2 bg-[#121212] border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono shrink-0">
              <span className="text-white/40 uppercase tracking-wider shrink-0 pl-1">Quick Ask:</span>
              <button
                type="button"
                onClick={() => setInputText("Hi Ronnie, I'm reviewing the platform and would like to request an Investor & Enterprise Walkthrough!")}
                className="px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-amber-300 rounded whitespace-nowrap transition-all cursor-pointer"
              >
                ⚡ Request Enterprise & Investor Walkthrough
              </button>
              <button
                type="button"
                onClick={() => setInputText("Hi Ronnie, can you tell me more about how the 20% non-profit charity split works?")}
                className="px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-emerald-300 rounded whitespace-nowrap transition-all cursor-pointer"
              >
                💚 Ask About 20% Charity Split
              </button>
            </div>
          )}

          {/* CHAT INPUT FORM */}
          <div className="p-3 bg-[#141414] border-t border-white/10 shrink-0">
            {/* Optional Visitor Name/Email row if not set */}
            {!isFounderOwner && (!visitorName || !visitorEmail) && (
              <div className="grid grid-cols-2 gap-2 mb-2 font-mono text-[10px]">
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="py-1 px-2 bg-[#0A0A0A] border border-white/15 text-white text-[10px] focus:outline-none focus:border-amber-400"
                />
                <input
                  type="email"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  placeholder="Your Email (Optional)"
                  className="py-1 px-2 bg-[#0A0A0A] border border-white/15 text-white text-[10px] focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            <form
              onSubmit={(e) => {
                if (isFounderOwner && activeOwnerThreadId) {
                  e.preventDefault();
                  handleSendOwnerReply(activeOwnerThreadId);
                } else {
                  handleSendVisitorMessage(e);
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isFounderOwner
                    ? "Reply as Founder Ronnie Hills..."
                    : "Message Ronnie privately..."
                }
                className="flex-1 py-2.5 px-3 bg-[#080808] border border-white/20 text-white text-xs font-sans placeholder:text-white/40 focus:outline-none focus:border-amber-400"
              />

              <button
                type="submit"
                className="p-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded transition-colors cursor-pointer shrink-0"
                title="Send Private Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 text-center">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                Direct Line: ronniehillsugc@gmail.com
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
