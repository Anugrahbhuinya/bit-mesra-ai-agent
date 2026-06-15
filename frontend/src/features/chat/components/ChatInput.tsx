import { useState } from "react";
import { Send, Mic, Square } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

interface ChatInputProps {
  onSend: (message: string, isVoice?: boolean) => Promise<void>;
  onStopSpeaking: () => void;
}

function ChatInput({ onSend, onStopSpeaking }: ChatInputProps) {
  const [input, setInput] = useState("");

  const { isSupported, isListening, startListening, stopListening } =
    useSpeechRecognition();

  const handleSend = async () => {
    const message = input.trim();

    if (!message) return;

    setInput("");
    onStopSpeaking();

    await onSend(message, false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSend();
    }
  };

  const handleVoiceInput = () => {
    onStopSpeaking();
    startListening(async (text: string) => {
      if (text.trim()) {
        setInput(text);
        await onSend(text, true);
        setInput("");
      }
    });
  };

  return (
    <div>
      {isListening && (
        <div className="mb-2 text-red-400 text-sm animate-pulse">
          🎤 Listening...
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about BIT Mesra..."
          className="
            flex-1
            bg-slate-800
            text-white
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        {isSupported && (
          <button
            type="button"
            onClick={isListening ? stopListening : handleVoiceInput}
            className={`
              px-4
              rounded-xl
              flex
              items-center
              justify-center
              transition
              ${
                isListening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-slate-700 hover:bg-slate-600"
              }
            `}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
          >
            {isListening ? <Square size={20} /> : <Mic size={20} />}
          </button>
        )}

        <button
          onClick={handleSend}
          className="
            bg-blue-600
            hover:bg-blue-700
            transition
            text-white
            px-5
            rounded-xl
            flex
            items-center
            justify-center
          "
          title="Send Message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
