import { useCallback, useEffect } from "react";
import { logger } from "../../api";

export const useDocumentPolling = (setComments, setInitialResolvedComments) => {
  const pollDocumentUpdates = useCallback(async () => {
    try {
      await Word.run(async (context) => {
        const docComments = context.document.body.getComments();
        docComments.load("items");
        await context.sync();

        docComments.items.forEach((comment) => {
          comment.load([
            "id",
            "authorName",
            "content",
            "creationDate",
            "replies",
            "resolved",
          ]);
          const range = comment.getRange();
          range.load("text");
        });
        await context.sync();

        const processedComments = await Promise.all(
          docComments.items.map(async (comment) => {
            const range = comment.getRange();
            await context.sync();

            return {
              id: comment.id,
              content: comment.content || "",
              documentText: range.content,
              author: comment.authorName || "Unknown Author",
              authorEmail: comment.authorEmail || "",
              resolved: comment.resolved || false,
              date: comment.creationDate
                ? new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZoneName: "short",
                  }).format(new Date(comment.creationDate))
                : new Date().toLocaleString(),
              replies:
                comment.replies?.items.map((reply) => ({
                  id: reply.id,
                  content: reply.content || "",
                  author: reply.authorName || "Unknown Author",
                  date: reply.creationDate
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZoneName: "short",
                      }).format(new Date(reply.creationDate))
                    : new Date().toLocaleString(),
                })) || [],
            };
          })
        );

        const unresolvedComments = processedComments.filter(
          (comment) => !comment.resolved
        );
        const resolvedComments = processedComments.filter(
          (comment) => comment.resolved
        );

        // Only update state if there is a change to avoid unnecessary re-renders
        setComments((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(unresolvedComments)) {
            return unresolvedComments;
          }
          return prev;
        });

        setInitialResolvedComments((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(resolvedComments)) {
            return resolvedComments;
          }
          return prev;
        });
      });
    } catch (error) {
      logger.error("Error polling document updates:", error);
    }
  }, [setComments, setInitialResolvedComments]);

  useEffect(() => {
    const pollInterval = setInterval(pollDocumentUpdates, 3000);
    return () => clearInterval(pollInterval);
  }, [pollDocumentUpdates]);

  return pollDocumentUpdates;
};
