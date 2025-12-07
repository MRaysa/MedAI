import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaSpinner,
  FaUser,
  FaTrash,
  FaMinus,
  FaExpand,
  FaCompress,
  FaHistory,
  FaLightbulb,
  FaHeartbeat,
  FaPills,
  FaStethoscope,
  FaCalendarAlt,
  FaQuestionCircle,
  FaMicrophone,
  FaMicrophoneSlash,
  FaCopy,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdHealthAndSafety, MdSend } from "react-icons/md";
import { BsChatDotsFill, BsThreeDots } from "react-icons/bs";
import { RiRobot2Fill } from "react-icons/ri";

const AIChat = ({ isOpen, onClose }) => {
  const { apiCall, user, dbUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickSuggestions = [
    { icon: FaHeartbeat, text: "Check my symptoms", color: "red" },
    { icon: FaPills, text: "Medication information", color: "purple" },
    { icon: FaStethoscope, text: "Health advice", color: "teal" },
    { icon: FaCalendarAlt, text: "Book appointment", color: "blue" },
    { icon: FaLightbulb, text: "Wellness tips", color: "yellow" },
    { icon: FaQuestionCircle, text: "General health questions", color: "green" },
  ];

  // Load chat history from localStorage
  useEffect(() => {
    if (user?.uid) {
      const savedMessages = localStorage.getItem(`medai_chat_${user.uid}`);
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
          setShowSuggestions(false);
        } catch (e) {
          console.error("Error loading chat history:", e);
        }
      }
    }
  }, [user?.uid]);

  // Save chat history to localStorage
  useEffect(() => {
    if (user?.uid && messages.length > 0) {
      localStorage.setItem(`medai_chat_${user.uid}`, JSON.stringify(messages));
    }
  }, [messages, user?.uid]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Build context from user's health data
      let userContext = "";
      if (dbUser) {
        userContext = `User Info: Name: ${dbUser.displayName || dbUser.firstName || "User"}, Role: ${dbUser.role || "patient"}. `;
      }

      const response = await apiCall("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: inputMessage.trim(),
          conversationHistory: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext,
        }),
      });

      console.log("AI Chat Response:", response);

      if (response.success) {
        // Handle different response structures
        const aiContent = response.message || response.data?.message || response.data || "I received your message but couldn't generate a response.";

        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: typeof aiContent === 'string' ? aiContent : JSON.stringify(aiContent),
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.message || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const clearChat = () => {
    setMessages([]);
    setShowSuggestions(true);
    if (user?.uid) {
      localStorage.removeItem(`medai_chat_${user.uid}`);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatMessage = (content) => {
    // Handle null/undefined content
    if (!content) return "";

    // Convert to string if not already
    const text = typeof content === 'string' ? content : String(content);

    // Simple markdown-like formatting
    return text
      .split("\n")
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Bullet points
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return `<li key=${i}>${line.substring(2)}</li>`;
        }
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return `<li key=${i}>${line.replace(/^\d+\.\s/, "")}</li>`;
        }
        return line;
      })
      .join("<br/>");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          height: isMinimized ? "auto" : isExpanded ? "90vh" : "600px",
          width: isExpanded ? "800px" : "400px",
        }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-24 right-6 bg-white rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-200 ${
          isExpanded ? "max-w-4xl" : "max-w-md"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <RiRobot2Fill className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  MedAI Assistant
                  <HiSparkles className="text-yellow-300" />
                </h3>
                <p className="text-xs text-teal-100">
                  {isLoading ? "Typing..." : "Online • Ready to help"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <FaMinus />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <MdHealthAndSafety className="text-4xl text-teal-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Hello{dbUser?.firstName ? `, ${dbUser.firstName}` : ""}! 👋
                  </h4>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                    I'm your AI health assistant. I can help with symptoms, medications,
                    wellness tips, and general health questions.
                  </p>

                  {/* Disclaimer */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6 mx-4">
                    <div className="flex items-start gap-2 text-left">
                      <FaExclamationTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-700">
                        <strong>Disclaimer:</strong> I provide general health information only.
                        Always consult a qualified healthcare professional for medical advice.
                      </p>
                    </div>
                  </div>

                  {/* Quick Suggestions */}
                  {showSuggestions && (
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {quickSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className={`flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition text-left text-sm group`}
                        >
                          <suggestion.icon className={`text-${suggestion.color}-500 group-hover:scale-110 transition`} />
                          <span className="text-gray-700">{suggestion.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Chat Messages */}
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-purple-600"
                          : message.isError
                          ? "bg-red-100"
                          : "bg-gradient-to-br from-teal-500 to-cyan-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <FaUser className="text-white text-xs" />
                      ) : message.isError ? (
                        <FaExclamationTriangle className="text-red-500 text-xs" />
                      ) : (
                        <FaRobot className="text-white text-xs" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`rounded-2xl p-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-sm"
                          : message.isError
                          ? "bg-red-50 text-red-700 border border-red-200 rounded-tl-sm"
                          : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                      }`}
                    >
                      <div
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content),
                        }}
                      />
                      <div
                        className={`flex items-center justify-between mt-2 pt-2 border-t ${
                          message.role === "user"
                            ? "border-white/20"
                            : "border-gray-100"
                        }`}
                      >
                        <span
                          className={`text-xs ${
                            message.role === "user" ? "text-white/70" : "text-gray-400"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {message.role === "assistant" && !message.isError && (
                          <button
                            onClick={() => copyToClipboard(message.content, index)}
                            className="text-gray-400 hover:text-gray-600 transition"
                            title="Copy message"
                          >
                            {copiedIndex === index ? (
                              <FaCheck className="text-green-500 text-xs" />
                            ) : (
                              <FaCopy className="text-xs" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                      <FaRobot className="text-white text-xs" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <BsThreeDots className="text-teal-500 animate-pulse text-xl" />
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              {/* Clear Chat Button */}
              {messages.length > 0 && (
                <div className="flex justify-center mb-3">
                  <button
                    onClick={clearChat}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  >
                    <FaTrash />
                    Clear conversation
                  </button>
                </div>
              )}

              {/* Input Field */}
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about your health..."
                    rows={1}
                    className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition text-sm"
                    style={{ maxHeight: "120px", minHeight: "48px" }}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl hover:from-teal-600 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-teal-500/25"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <MdSend className="text-xl" />
                  )}
                </button>
              </div>

              {/* Powered By */}
              <p className="text-center text-xs text-gray-400 mt-3">
                Powered by MedAI • Your health companion
              </p>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChat;
