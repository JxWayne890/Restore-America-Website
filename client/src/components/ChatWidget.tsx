import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, X, Send, Phone, Shield } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function generateSessionId() {
  return "chat_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm the Restore America virtual assistant. Have you experienced storm, fire, flood, or hail damage? I can help you get a FREE inspection scheduled today! 🏠",
    },
  ]);
  const [input, setInput] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [sessionId] = useState(() => generateSessionId());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = trpc.chat.message.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      setIsTyping(false);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please call us directly at 844-LETS-RESTORE!" },
      ]);
      setIsTyping(false);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    // Extract name/phone from message if present
    const phoneMatch = userMsg.match(/\b(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})\b/);
    const detectedPhone = phoneMatch ? phoneMatch[1] : visitorPhone;

    sendMessage.mutate({
      sessionId,
      message: userMsg,
      visitorName: visitorName || undefined,
      visitorPhone: detectedPhone || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        style={{ background: "linear-gradient(135deg, #CC2222, #8B0000)" }}
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}
        style={{ maxHeight: "520px", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: "linear-gradient(135deg, #1B3A6B, #0f2447)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#CC2222" }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: "Oswald, sans-serif" }}>
                RESTORE AMERICA
              </p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-xs">Online — Avg reply &lt;1 min</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ background: "#f8f9fa", minHeight: "280px", maxHeight: "320px" }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1"
                  style={{ background: "#1B3A6B" }}
                >
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "text-white rounded-br-sm"
                    : "text-gray-800 rounded-bl-sm"
                }`}
                style={{
                  background: msg.role === "user" ? "#CC2222" : "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                style={{ background: "#1B3A6B" }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
          {["Free Inspection", "File a Claim", "Emergency?"].map((action) => (
            <button
              key={action}
              onClick={() => {
                setInput(action);
                setTimeout(handleSend, 0);
              }}
              className="flex-shrink-0 text-xs px-3 py-1 rounded-full border font-medium transition-colors hover:text-white"
              style={{ borderColor: "#1B3A6B", color: "#1B3A6B" }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "#1B3A6B";
                (e.target as HTMLButtonElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "transparent";
                (e.target as HTMLButtonElement).style.color = "#1B3A6B";
              }}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50"
            disabled={sendMessage.isPending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sendMessage.isPending}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
            style={{ background: "#CC2222" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Footer CTA */}
        <div
          className="px-4 py-2 flex items-center justify-center gap-2"
          style={{ background: "#1B3A6B" }}
        >
          <Phone className="w-3 h-3 text-yellow-300" />
          <a href="tel:+18445387737" className="text-yellow-300 text-xs font-bold hover:text-white transition-colors">
            844-LETS-RESTORE — Available 24/7
          </a>
        </div>
      </div>
    </>
  );
}
