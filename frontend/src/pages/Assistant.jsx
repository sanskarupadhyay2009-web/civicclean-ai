import { motion } from "framer-motion";
import { Bot, Send, Paperclip, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { chatWithAI, chatWithImage } from "../services/aiService";

import "../styles/assistant.css";

function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hello! I'm CivicClean AI.\n\nAsk me anything about waste management, recycling, pollution or sustainability. You can also attach a photo of waste or litter and I'll take a look."
    }
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedPreview, setAttachedPreview] = useState(null);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAttachedImage(file);
    setAttachedPreview(URL.createObjectURL(file));

    // allow re-selecting the same file later
    e.target.value = "";
  };

  const removeAttachment = () => {
    setAttachedImage(null);
    setAttachedPreview(null);
  };

  const sendMessage = async () => {
    const trimmed = message.trim();

    if ((!trimmed && !attachedImage) || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      text: trimmed,
      image: attachedPreview,
    };

    setMessages((prev) => [...prev, userMessage]);

    const prompt = trimmed;
    const imageToSend = attachedImage;

    setMessage("");
    setAttachedImage(null);
    setAttachedPreview(null);
    setLoading(true);

    try {
      const { data } = imageToSend
        ? await chatWithImage(prompt, imageToSend)
        : await chatWithAI(prompt);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (err) {
      const friendlyMessage =
        err?.response?.data?.message ||
        "❌ Sorry, I couldn't reach Gemini. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: friendlyMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.main
      className="assistant-page"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="assistant-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>CivicClean AI Assistant</h1>

        <p>
          Ask anything about recycling, waste management, sustainability and
          environmental awareness — or attach a photo.
        </p>
      </motion.div>

      <div className="assistant-window">
        <div className="chat-area">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === "assistant" ? "bot-message" : "user-message"}
            >
              {msg.role === "assistant" && (
                <div className="bot-avatar">
                  <Bot size={20} />
                </div>
              )}

              <div className="message-bubble">
                {msg.image && (
                  <img src={msg.image} alt="Attachment" className="chat-image" />
                )}

                {msg.text && <div>{msg.text}</div>}
              </div>
            </div>
          ))}

          {loading && (
            <div className="bot-message">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>

              <div className="message-bubble typing">
                CivicClean AI is thinking...
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {attachedPreview && (
          <div className="attachment-preview">
            <img src={attachedPreview} alt="Selected attachment" />
            <button
              type="button"
              className="remove-attachment"
              onClick={removeAttachment}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="chat-input">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="attach-btn"
            onClick={handleAttachClick}
            disabled={loading}
            title="Attach an image"
          >
            <Paperclip size={20} />
          </button>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask CivicClean AI..."
            disabled={loading}
          />

          <button type="button" onClick={sendMessage} disabled={loading}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.main>
  );
}

export default Assistant;
