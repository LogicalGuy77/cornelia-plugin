import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";

const ChatWindow = ({
  documentContent,
  messages,
  setMessages,
  isLoading,
  error,
  onSubmit,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Format timestamp to remove seconds
  const formatTimestamp = (timestamp) => {
    // Handle timestamp that's already in string format (HH:MM:SS AM/PM)
    if (typeof timestamp === "string") {
      const timeParts = timestamp.split(":");
      if (timeParts.length === 3) {
        const [hours, minutes, secondsWithAmPm] = timeParts;
        const amPm = secondsWithAmPm.split(" ")[1];
        return `${hours}:${minutes} ${amPm}`.toLowerCase();
      }
      return timestamp; // Return as is if not in expected format
    }

    // Handle Date object
    return new Date(timestamp)
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  const searchInDocument = async (searchText) => {
    try {
      await Word.run(async (context) => {
        const body = context.document.body;
        body.load("text");
        await context.sync();

        const searchResults = body.search(searchText, { matchCase: false });
        context.load(searchResults, "text");
        await context.sync();

        if (searchResults.items.length > 0) {
          searchResults.items[0].select();
          searchResults.items[0].scrollIntoView();

          setTimeout(async () => {
            await Word.run(async (context) => {
              searchResults.items[0].font.highlightColor = "None";
              await context.sync();
            });
          }, 2000);
        }
      });
    } catch (error) {
      console.error("Error searching document:", error);
    }
  };

  const renderInlineFormatting = (text, citationTexts) => {
    if (!text) return null;

    const parts = text.split(/(\[\d+\](?:\s*\([^)]+\))?|\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      if (part?.match(/\[(\d+)\](?:\s*\([^)]+\))?/)) {
        const matches = part.match(/\[(\d+)\](?:\s*\(([^)]+)\))?/);
        if (!matches) return part;

        const citationNumber = matches[1];
        const sourceText = citationTexts[citationNumber];

        return (
          <span key={index} className="inline-flex items-center">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                if (sourceText) {
                  searchInDocument(sourceText);
                }
              }}
              title={sourceText || `Citation ${citationNumber}`}
            >
              {`[${citationNumber}]`}
            </a>
          </span>
        );
      }

      if (part?.match(/^\*\*.*\*\*$/)) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="text-blue-700 font-semibold">
            {boldText}
          </strong>
        );
      }

      if (part?.startsWith("`") && part?.endsWith("`")) {
        return (
          <code
            key={index}
            className="bg-gray-100 text-red-600 px-2 py-0.5 rounded font-mono text-sm"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return part;
    });
  };

  const renderMessageContent = (content) => {
    const citationTexts = {};
    const citationRegex = /\[(\d+)\]:\s*"([^"]+)"/g;

    const contentWithoutCitations = content.replace(
      /\n\[(\d+)\]:\s*"([^"]+)"/g,
      (match, number, text) => {
        citationTexts[number] = text.trim();
        return "";
      }
    );

    const paragraphs = contentWithoutCitations.split("\n\n");

    return paragraphs.map((paragraph, pIndex) => {
      if (paragraph.includes("1.") && paragraph.includes("2.")) {
        const items = paragraph.split(/(?=\d+\.\s)/).filter(Boolean);

        return (
          <ol
            key={pIndex}
            className="list-decimal list-outside mb-4 last:mb-0 pl-6 space-y-3"
          >
            {items.map((item, itemIndex) => {
              const itemContent = item.replace(/^\d+\.\s/, "").trim();
              return (
                <li key={itemIndex} value={itemIndex + 1} className="pl-2">
                  {renderInlineFormatting(itemContent, citationTexts)}
                </li>
              );
            })}
          </ol>
        );
      }

      return (
        <p key={pIndex} className="mb-4 last:mb-0 leading-relaxed">
          {renderInlineFormatting(paragraph, citationTexts)}
        </p>
      );
    });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I can help you analyze this document. What would you like to know?",
          isInitialTip: true,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput("");
    await onSubmit(messageText);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isSystemMessage = message.isInitialTip || message.isError;

          return (
            <div
              key={index}
              className={`animate-fadeIn ${
                isSystemMessage
                  ? "flex justify-center"
                  : message.role === "user"
                  ? "flex flex-col items-end"
                  : "flex flex-col items-start"
              }`}
              ref={index === messages.length - 1 ? messagesEndRef : null}
            >
              {isSystemMessage ? (
                <div
                  className="flex items-center gap-2 px-6 py-2.5 bg-white rounded-full 
                    text-xs font-medium text-gray-600 border border-gray-200 shadow-sm"
                >
                  <span className="w-4 h-4">ℹ</span>
                  {message.content}
                </div>
              ) : (
                <div className="space-y-1.5 max-w-[85%] group">
                  <div
                    className={`p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-800 shadow-md"
                    }`}
                  >
                    <div className="text-sm">
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                  <div
                    className={`text-xs opacity-70 group-hover:opacity-100 transition-opacity ${
                      message.role === "user"
                        ? "text-right text-blue-700"
                        : "text-left text-gray-600"
                    }`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-center items-center p-4">
            <Spin size="small" />
          </div>
        )}
      </div>

      <div className="border-t p-4 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isLoading ? "Please wait..." : "Type your question here..."
            }
            className="flex-grow rounded-full border-gray-200 hover:border-gray-300 focus:border-blue-500 
              shadow-sm transition-colors duration-200"
            disabled={isLoading}
          />
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            disabled={isLoading || !input.trim()}
            className={`rounded-full flex items-center justify-center w-11 h-11 !p-0 
              transition-all duration-200 hover:scale-105 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
