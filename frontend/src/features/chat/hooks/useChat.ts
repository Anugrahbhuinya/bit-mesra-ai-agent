import { useState } from "react";

import { sendMessage } from "../services/chatApi";
import type { ChatMessage } from "../types";
import { useTextToSpeech } from "./useTextToSpeech";

export const useChat = () => {
  const { speak, stopSpeaking, speakingText } = useTextToSpeech();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hey I am the BIT Mesra agent",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendChatMessage = async (text: string, isVoice = false) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);

      const response = await sendMessage(text);

      const botMessage: ChatMessage = {
        sender: "bot",
        text: response.answer,
      };

      setMessages((prev) => [...prev, botMessage]);
      if (isVoice) {
        speak(response.answer);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong.",
        },
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendChatMessage,
    speak,
    stopSpeaking,
    speakingText,
  };
};
