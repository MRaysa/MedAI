import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChatDotsFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { RiRobot2Fill } from "react-icons/ri";
import AIChat from "./AIChat";

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after 5 seconds
  useState(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setHasNewMessage(false);
    setShowTooltip(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isChatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute bottom-full right-0 mb-3 whitespace-nowrap"
            >
              <div className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm shadow-lg">
                <div className="flex items-center gap-2">
                  <HiSparkles className="text-yellow-400" />
                  Chat with AI Health Assistant
                </div>
                <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={toggleChat}
          onMouseEnter={() => !isChatOpen && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isChatOpen
              ? "bg-gray-700 hover:bg-gray-800"
              : "bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600"
          }`}
          style={{
            boxShadow: isChatOpen
              ? "0 10px 40px rgba(0,0,0,0.3)"
              : "0 10px 40px rgba(20,184,166,0.4)",
          }}
        >
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes className="text-white text-2xl" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <RiRobot2Fill className="text-white text-3xl" />
                {/* Sparkle effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <HiSparkles className="text-yellow-300 text-sm" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* New message indicator */}
          {hasNewMessage && !isChatOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">1</span>
            </motion.div>
          )}

          {/* Pulse effect when closed */}
          {!isChatOpen && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-teal-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Chat Modal */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default FloatingChatButton;
