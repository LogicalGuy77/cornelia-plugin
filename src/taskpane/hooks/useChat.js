import { useState } from "react";
import { performAnalysis } from "../../api";

export const useChat = (documentContent) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  const handleChatSubmit = async (input) => {
    const trimmedInput = input.trim();
    if (!trimmedInput || chatLoading) return;

    const timestamp = new Date().toLocaleTimeString();

    // Append user message immediately
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedInput, timestamp },
    ]);

    setChatLoading(true);
    setChatError(null);

    try {
      const result = await performAnalysis(
        "ask",
        `Document Content:\n${documentContent}\n\nQuestion: ${trimmedInput}`,
        "document"
      );

      if (!result) {
        throw new Error("Empty response from performAnalysis");
      }

      // Append assistant response
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatError(error.message || "An unknown error occurred.");

      // Append error message
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString(),
          isError: true,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return {
    chatMessages,
    setChatMessages,
    chatLoading,
    chatError,
    handleChatSubmit,
  };
};
