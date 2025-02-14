import { useState } from "react";
import { brainstormChat } from "../../api";
import { logger } from "../../api";

export const useBrainstorm = () => {
  const [isBrainstormModalVisible, setIsBrainstormModalVisible] = useState(
    false
  );
  const [brainstormMessages, setBrainstormMessages] = useState([]);
  const [brainstormLoading, setBrainstormLoading] = useState(false);

  const handleBrainstormSubmit = async (
    messageText,
    selectedText,
    documentContent
  ) => {
    const timestamp = new Date().toLocaleTimeString();

    // Add user message immediately to the chat
    setBrainstormMessages((prev) => [
      ...prev,
      { role: "user", content: messageText, timestamp },
    ]);

    try {
      setBrainstormLoading(true);

      const result = await brainstormChat(
        messageText,
        selectedText,
        "",
        documentContent
      );

      if (!result) {
        throw new Error("Empty response from brainstormChat");
      }

      // Update messages with assistant response
      setBrainstormMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      if (logger?.error) {
        logger.error("Error in brainstorm:", error);
      } else {
        console.error("Error in brainstorm:", error);
      }

      // Append an error message to the chat
      setBrainstormMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error while processing your request.",
          isError: true,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setBrainstormLoading(false);
    }
  };

  return {
    isBrainstormModalVisible,
    setIsBrainstormModalVisible,
    brainstormMessages,
    setBrainstormMessages,
    brainstormLoading,
    handleBrainstormSubmit,
  };
};
