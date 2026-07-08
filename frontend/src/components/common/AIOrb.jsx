import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Bot, X, Send, Paperclip } from "lucide-react";

import { chatWithAI, chatWithImage } from "../../services/aiService";

function AIOrb() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm CivicClean AI. Ask me anything about waste, recycling or the environment — you can attach a photo too.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);

  const fileInputRef = useRef(null);

  const isAssistant = location.pathname === "/assistant";

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAttachedImage(file);
    setAttachedPreview(URL.createObjectURL(file));

    e.target.value = "";
  };

  const removeAttachment = () => {
    setAttachedImage(null);
    setAttachedPreview(null);
  };

  const handleSend = async () => {
    const trimmed = input.trim();

    if ((!trimmed && !attachedImage) || loading) return;

    const userMsg = {
      role: "user",
      text: trimmed,
      image: attachedPreview,
    };

    setMessages((prev) => [...prev, userMsg]);

    const prompt = trimmed;
    const imageToSend = attachedImage;

    setInput("");
    setAttachedImage(null);
    setAttachedPreview(null);
    setLoading(true);

    try {
      const { data } = imageToSend
        ? await chatWithImage(prompt, imageToSend)
        : await chatWithAI(prompt);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply },
      ]);
    } catch (err) {
      const friendlyMessage =
        err?.response?.data?.message ||
        "❌ Sorry, I couldn't reach Gemini. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: friendlyMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isAssistant && (
          <motion.div
            className="ai-orb"
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            exit={{
              x: -window.innerWidth * 0.35,
              y: -window.innerHeight * 0.45,
              scale: 0.05,
              rotate: 720,
              opacity: 0,
            }}
            transition={{ duration: 0.85, ease: "easeInOut" }}
          >
            <div className="orb-glow" />
            <motion.div
              className="orb-ring orb-ring-1"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            />
            <motion.div
              className="orb-ring orb-ring-2"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
            />
            <motion.div
              className="orb-wave orb-wave-1"
              animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeOut" }}
            />
            <motion.div
              className="orb-wave orb-wave-2"
              animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 3.4, ease: "easeOut", delay: 0.4 }}
            />
            <motion.div
              className="orb-core"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            >
              <Bot size={22} />
            </motion.div>
            {[...Array(8)].map((_, index) => (
              <motion.span
                key={index}
                className="orb-particle"
                style={{ transform: `rotate(${index * 45}deg) translateY(-40px)` }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.15, 0.7] }}
                transition={{ repeat: Infinity, duration: 2.2, delay: index * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ai-header">
              <div className="ai-title">
                <Bot size={18} />
                CivicClean AI
              </div>

              <X
                size={18}
                className="close-btn"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="ai-chat">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role}`}>
                  {msg.image && (
                    <img src={msg.image} alt="Attachment" className="orb-chat-image" />
                  )}
                  {msg.text && <span>{msg.text}</span>}
                </div>
              ))}

              {loading && (
                <div className="msg ai orb-typing">CivicClean AI is thinking...</div>
              )}
            </div>

            {attachedPreview && (
              <div className="orb-attachment-preview">
                <img src={attachedPreview} alt="Selected attachment" />
                <button
                  type="button"
                  className="orb-remove-attachment"
                  onClick={removeAttachment}
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="ai-input">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <button
                type="button"
                className="orb-attach-btn"
                onClick={handleAttachClick}
                disabled={loading}
                title="Attach an image"
              >
                <Paperclip size={16} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask CivicClean AI..."
                disabled={loading}
              />

              <button onClick={handleSend} disabled={loading}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIOrb;
