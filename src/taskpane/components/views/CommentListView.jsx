import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  Card,
  Typography,
  Badge,
  Button,
  Tooltip,
  Collapse,
  message,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UndoOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import CommentActions from "./CommentActions";

const { Text } = Typography;
const { Panel } = Collapse;

const CommentList = React.memo(
  ({
    comments,
    setComments,
    initialResolvedComments = [],
    onCommentUpdate,
  }) => {
    const [resolvedComments, setResolvedComments] = useState([]);

    useEffect(() => {
      if (initialResolvedComments?.length > 0) {
        setResolvedComments(initialResolvedComments);
      }
    }, [initialResolvedComments]);

    const formatDate = (dateString) => {
      try {
        console.log("Incoming date string:", dateString);

        if (!dateString) {
          return "Date not available";
        }

        const parsedDate = new Date(dateString);

        if (parsedDate instanceof Date && !isNaN(parsedDate)) {
          return parsedDate.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }

        const parts = dateString.match(
          /([A-Za-z]+ \d+, \d+) at (\d+:\d+:\d+ [AP]M) GMT([+-]\d+:\d+)/
        );

        if (parts) {
          const [_, datePart, timePart] = parts;
          const date = new Date(`${datePart} ${timePart}`);

          if (date instanceof Date && !isNaN(date)) {
            return date.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          }
        }

        return "Date not available";
      } catch (error) {
        console.error("Error formatting date:", error, "Input:", dateString);
        return "Date not available";
      }
    };

    const navigateToComment = async (commentId) => {
      try {
        await Word.run(async (context) => {
          // Get all comments in the document
          const docComments = context.document.body.getComments();
          docComments.load("items");
          await context.sync();
          const comment = docComments.items.find((c) => c.id === commentId);

          if (comment) {
            // Load the comment's content range
            const contentRange = comment.getRange();
            contentRange.load("text");
            await context.sync();

            // Select and scroll to the comment's range
            contentRange.select();
            contentRange.scrollIntoView();
            await context.sync();
          } else {
            logger.warn("Comment not found:", { commentId });
          }
        });
      } catch (error) {
        logger.error("Error navigating to comment:", { error, commentId });
        console.error("Failed to navigate to comment:", error);
      }
    };

    const handleResolveComment = useCallback(
      async (commentId) => {
        try {
          await Word.run(async (context) => {
            const docComments = context.document.body.getComments();
            docComments.load("items");
            await context.sync();

            const comment = docComments.items.find((c) => c.id === commentId);

            if (comment) {
              comment.resolved = true;
              await context.sync();

              setComments((prevComments) => {
                const commentToMove = prevComments.find(
                  (c) => c.id === commentId
                );
                setResolvedComments((prev) => [
                  ...prev,
                  {
                    ...commentToMove,
                    resolved: true,
                    content: commentToMove.content,
                  },
                ]);
                return prevComments.filter((c) => c.id !== commentId);
              });

              message.success("Comment resolved successfully");
            }
          });
        } catch (error) {
          console.error("Failed to resolve comment:", error);
          message.error("Failed to resolve comment");
        }
      },
      [setComments]
    );

    const handleUnresolveComment = async (commentId) => {
      try {
        await Word.run(async (context) => {
          const docComments = context.document.body.getComments();
          docComments.load("items");
          await context.sync();

          const comment = docComments.items.find((c) => c.id === commentId);

          if (comment) {
            comment.resolved = false;
            await context.sync();

            setResolvedComments((prevResolved) => {
              const commentToMove = prevResolved.find(
                (c) => c.id === commentId
              );
              setComments((prev) => [
                ...prev,
                { ...commentToMove, resolved: false },
              ]);
              return prevResolved.filter((c) => c.id !== commentId);
            });

            message.success("Comment unresolved successfully");
          } else {
            message.error("Comment not found");
          }
        });
      } catch (error) {
        console.error("Failed to unresolve comment:", error);
        message.error("Failed to unresolve comment");
      }
    };

    const renderReplyList = (replies) => {
      if (!replies || replies.length === 0) return null;

      return (
        <div className="replies-thread">
          {replies.map((reply) => (
            <div key={reply.id} className="reply-bubble">
              <div className="reply-header">
                <div className="reply-author">
                  <UserOutlined className="text-gray-500" />
                  <Text strong className="text-sm">
                    {reply.author}
                  </Text>
                  <Text type="secondary" className="text-xs ml-2">
                    {formatDate(reply.date)}
                  </Text>
                </div>
              </div>
              <div className="reply-content">{reply.content}</div>
            </div>
          ))}
        </div>
      );
    };

    const renderCommentCard = (comment, isResolved = false) => (
      <Card className={`comment-card ${isResolved ? "resolved" : ""}`}>
        <div className="comment-header flex justify-between items-start">
          <div className="comment-author">
            <div className="flex items-start gap-2">
              <div className="comment-author-avatar">
                <UserOutlined className="text-white" />
              </div>
              <div className="comment-author-info flex flex-col">
                <Text strong className="text-sm author-name">
                  {comment.author}
                </Text>
                <Text type="secondary" className="text-xs date">
                  <ClockCircleOutlined className="mr-1" />
                  {formatDate(comment.date)}
                </Text>
              </div>
            </div>
          </div>
          <div className="comment-controls">
            {!isResolved && (
              <Tooltip title="Mark as Resolved">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  className="resolve-btn"
                  onClick={() => handleResolveComment(comment.id)}
                />
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1 pb-2">
          <div className="w-8 flex-shrink-0">
            {/* This empty div maintains spacing inline with avatar */}
          </div>
          <div
            className="comment-content-wrapper flex-grow cursor-pointer hover:bg-gray-50"
            onClick={() => navigateToComment(comment.id)}
          >
            <Text className="comment-text">{comment.content}</Text>
          </div>
        </div>

        {renderReplyList(comment.replies)}
        {!isResolved && (
          <CommentActions comment={comment} onCommentUpdate={onCommentUpdate} />
        )}
      </Card>
    );

    return (
      <div className="comments-container">
        {resolvedComments.length > 0 && (
          <div className="resolved-comments-section">
            <div className="sticky-header">
              <Collapse
                className="mb-4"
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  header={
                    <span className="text-green-600 font-medium">
                      Resolved Comments ({resolvedComments.length})
                    </span>
                  }
                  key="resolved"
                >
                  <div className="resolved-comments-scroll">
                    <List
                      className="resolved-comment-list"
                      itemLayout="vertical"
                      dataSource={resolvedComments}
                      renderItem={(comment) => renderCommentCard(comment, true)}
                    />
                  </div>
                </Panel>
              </Collapse>
            </div>
          </div>
        )}

        <List
          className="comment-list"
          itemLayout="vertical"
          dataSource={comments}
          renderItem={(comment) => renderCommentCard(comment, false)}
        />
      </div>
    );
  }
);

export default CommentList;
