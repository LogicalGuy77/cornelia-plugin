import { useState, useCallback, useEffect } from "react";
import { logger } from "../../api";
import { useDocumentPolling } from "./useDocumentPolling";

export const useDocument = () => {
  const [documentContent, setDocumentContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [comments, setComments] = useState([]);
  const [initialResolvedComments, setInitialResolvedComments] = useState([]);

  // Document load handler
  const initialDocumentLoad = useCallback(async () => {
    try {
      await Word.run(async (context) => {
        const body = context.document.body;
        body.load("text");
        await context.sync();
        setDocumentContent(body.text);
      });
    } catch (error) {
      logger.error("Error in initial document load:", error);
    }
  }, []);

  // Text selection handler
  const handleTextSelection = useCallback(async () => {
    try {
      await Word.run(async (context) => {
        const selection = context.document.getSelection();
        selection.load("text");
        await context.sync();
        setSelectedText(selection.text.trim());
      });
    } catch (error) {
      logger.error("Error getting selected text:", error);
      setSelectedText(""); // Clearing selected text in case of error
    }
  }, []);

  // Use the document polling hook
  const pollDocumentUpdates = useDocumentPolling(
    setComments,
    setInitialResolvedComments
  );

  // Handle comment updates
  const handleCommentUpdate = useCallback((updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  }, []);

  useEffect(() => {
    // Initial document load
    initialDocumentLoad();

    // Set up text selection listener
    const handleSelectionChange = () => {
      handleTextSelection();
    };

    Office.context.document.addHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      handleSelectionChange,
      (result) => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          logger.error("Failed to add selection change handler");
        }
      }
    );

    return () => {
      Office.context.document.removeHandlerAsync(
        Office.EventType.DocumentSelectionChanged,
        handleSelectionChange,
        (result) => {
          if (result.status !== Office.AsyncResultStatus.Succeeded) {
            logger.error("Failed to remove selection change handler");
          }
        }
      );
    };
  }, [initialDocumentLoad, handleTextSelection]);

  return {
    documentContent,
    selectedText,
    comments,
    initialResolvedComments,
    setComments,
    setSelectedText,
    handleCommentUpdate,
    pollDocumentUpdates,
  };
};
