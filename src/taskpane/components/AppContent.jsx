import React, { useCallback, useEffect } from "react";
import { Layout, Button, Typography, message, Input } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import MainContent from "./MainContent";
import { useDocument } from "../hooks/useDocument";
import { useSummary } from "../hooks/useSummary";
import { useAppState } from "../hooks/useAppState";
import { useChat } from "../hooks/useChat";
import { useBrainstorm } from "../hooks/useBrainstorm";
import { useParties } from "../hooks/useParties";
import { explainText, redraftText } from "../../api";
import { logger } from "../../api";

const { Text } = Typography;
const { Content } = Layout;

const AppContent = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  const {
    documentContent,
    selectedText,
    comments,
    initialResolvedComments,
    setComments,
    setSelectedText,
    handleCommentUpdate,
  } = useDocument();

  const {
    summary,
    summaryLoading,
    summaryProgress,
    summaryError,
    homeSummaryLoading,
    homeSummaryReady,
    handleGenerateSummary,
    handleHomeSummaryClick,
  } = useSummary(documentContent);

  const {
    chatMessages,
    setChatMessages,
    chatLoading,
    chatError,
    handleChatSubmit,
  } = useChat(documentContent);

  const {
    isBrainstormModalVisible,
    setIsBrainstormModalVisible,
    brainstormMessages,
    setBrainstormMessages,
    brainstormLoading,
    handleBrainstormSubmit,
  } = useBrainstorm();

  const {
    activeView,
    setActiveView,
    clauseAnalysis,
    setClauseAnalysis,
    clauseAnalysisLoading,
    setClauseAnalysisLoading,
    clauseAnalysisCounts,
    setClauseAnalysisCounts,
    isRedraftModalVisible,
    setIsRedraftModalVisible,
    redraftContent,
    setRedraftContent,
    selectedClause,
    setSelectedClause,
    generatedRedraft,
    setGeneratedRedraft,
    generatingRedrafts,
    setGeneratingRedrafts,
    redraftedClauses,
    setRedraftedClauses,
    redraftedTexts,
    setRedraftedTexts,
    redraftReviewStates,
    setRedraftReviewStates,
    isExplaining,
    setIsExplaining,
    explanation,
    setExplanation,
    commentDraft,
    setCommentDraft,
    isAddingComment,
    setIsAddingComment,
    redraftTextAreaRef,
  } = useAppState();

  const {
    parties,
    setParties,
    isLoadingParties,
    setIsLoadingParties,
    selectedParty,
    setSelectedParty,
    getTagColor,
  } = useParties();

  const handleChangeParty = useCallback(() => {
    setClauseAnalysis(null);
    setSelectedParty(null);
    setClauseAnalysisCounts({
      acceptable: 0,
      risky: 0,
      missing: 0,
    });
  }, [setClauseAnalysis, setSelectedParty, setClauseAnalysisCounts]);

  const handleTextSelection = useCallback(async () => {
    try {
      await Word.run(async (context) => {
        const selection = context.document.getSelection();
        selection.load("text");
        await context.sync();
        const selectedContent = selection.text.trim();
        console.log("Selected text:", selectedContent); // Debug log
        setSelectedText(selectedContent);
      });
    } catch (error) {
      logger.error("Error getting selected text:", error);
      setSelectedText("");
    }
  }, [setSelectedText]);

  useEffect(() => {
    const handleSelectionChange = () => {
      handleTextSelection();
    };

    // Add event handler when component mounts
    Office.context.document.addHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      handleSelectionChange
    );

    // Remove event handler when component unmounts
    return () => {
      Office.context.document.removeHandlerAsync(
        Office.EventType.DocumentSelectionChanged,
        handleSelectionChange
      );
    };
  }, [handleTextSelection]);

  const handleLogout = () => {
    logout();
    message.success("Successfully logged out");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const { TextArea } = Input;

  const handleExplain = async () => {
    if (!selectedText || !documentContent) return;

    setIsExplaining(true);
    try {
      const result = await explainText(selectedText, documentContent);

      if (result) {
        setExplanation({
          text: selectedText,
          explanation: result,
          timestamp: new Date().toISOString(),
        });
      } else {
        message.error("Failed to get explanation");
      }
    } catch (error) {
      logger.error("Error in explain text:", error);
      message.error(
        "Failed to get explanation: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const handleRedraft = async () => {
    if (!selectedText) return;

    try {
      setGeneratingRedrafts((prev) => new Map(prev).set(selectedText, true));
      setIsRedraftModalVisible(false);

      const result = await redraftText(
        selectedText,
        documentContent,
        redraftContent
      );

      if (result) {
        setGeneratedRedraft({
          originalText: selectedText,
          redraftedText: result,
          instructions: redraftContent,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      logger.error("Error generating redraft:", error);
      message.error("Failed to generate redraft: " + error.message);
    } finally {
      setGeneratingRedrafts((prev) => {
        const newMap = new Map(prev);
        newMap.delete(selectedText);
        return newMap;
      });
      setRedraftContent("");
    }
  };

  const handleAcceptRedraft = async () => {
    if (!generatedRedraft) return;

    try {
      await Word.run(async (context) => {
        const selection = context.document.getSelection();
        selection.insertText(
          generatedRedraft.redraftedText,
          Word.InsertLocation.replace
        );
        await context.sync();

        setRedraftedTexts((prev) =>
          new Map(prev).set(
            generatedRedraft.originalText,
            generatedRedraft.redraftedText
          )
        );
        setGeneratedRedraft(null);
        message.success("Redraft applied successfully");
      });
    } catch (error) {
      logger.error("Error applying redraft:", error);
      message.error("Failed to apply redraft: " + error.message);
    }
  };

  const handleAddComment = async () => {
    if (!commentDraft?.text || !selectedText) return;

    try {
      setIsAddingComment(true);

      await Word.run(async (context) => {
        const selection = context.document.getSelection();
        selection.insertComment(commentDraft.text);
        await context.sync();

        setComments((prev) => [
          ...prev,
          { text: commentDraft.text, timestamp: new Date().toISOString() },
        ]);
        setCommentDraft(null);
        message.success("Comment added successfully");
      });
    } catch (error) {
      logger.error("Error adding comment:", error);
      message.error("Failed to add comment: " + error.message);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleRedraftModalVisibility = (visible) => {
    setIsRedraftModalVisible(visible);
  };

  const handleRedraftContentChange = (content) => {
    setRedraftContent(content);
  };

  const handleSelectedClauseChange = (clause) => {
    setSelectedClause(clause);
  };

  const handleGeneratingRedraftsChange = (drafts) => {
    setGeneratingRedrafts(drafts);
  };

  const handleRedraftedClausesChange = (clauses) => {
    setRedraftedClauses(clauses);
  };

  const handleRedraftedTextsChange = (texts) => {
    setRedraftedTexts(texts);
  };

  const handleRedraftReviewStatesChange = (states) => {
    setRedraftReviewStates(states);
  };

  return (
    <Layout className="h-screen">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          {(activeView === "chat" || activeView === "analysis") && (
            <Button
              onClick={() => setActiveView("home")}
              type="text"
              className="flex items-center !p-2 hover:bg-gray-50 rounded-full"
              icon={<ArrowLeftOutlined />}
            />
          )}
          <Text strong className="text-lg">
            {activeView === "chat"
              ? "Chat with Cornelia"
              : activeView === "analysis"
              ? "Clause Analysis"
              : "Cornelia"}
          </Text>
        </div>
        <Button
          onClick={handleLogout}
          type="link"
          danger
          className="hover:text-red-600"
        >
          Logout
        </Button>
      </div>
      <Content className="flex-1 overflow-auto bg-gray-100">
        <MainContent
          activeView={activeView}
          documentContent={documentContent}
          summary={summary}
          summaryLoading={summaryLoading}
          summaryProgress={summaryProgress}
          summaryError={summaryError}
          handleGenerateSummary={handleGenerateSummary}
          comments={comments}
          setComments={setComments}
          initialResolvedComments={initialResolvedComments}
          handleCommentUpdate={handleCommentUpdate}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chatLoading={chatLoading}
          chatError={chatError}
          handleChatSubmit={handleChatSubmit}
          clauseAnalysisLoading={clauseAnalysisLoading}
          selectedParty={selectedParty}
          clauseAnalysis={clauseAnalysis}
          setActiveView={setActiveView}
          getTagColor={getTagColor}
          handleChangeParty={handleChangeParty}
          isRedraftModalVisible={isRedraftModalVisible}
          redraftContent={redraftContent}
          selectedClause={selectedClause}
          generatedRedraft={generatedRedraft}
          generatingRedrafts={generatingRedrafts}
          redraftedClauses={redraftedClauses}
          redraftedTexts={redraftedTexts}
          redraftReviewStates={redraftReviewStates}
          onRedraftModalVisibility={handleRedraftModalVisibility}
          onRedraftContentChange={handleRedraftContentChange}
          onSelectedClauseChange={handleSelectedClauseChange}
          onGeneratingRedraftsChange={handleGeneratingRedraftsChange}
          onRedraftedClausesChange={handleRedraftedClausesChange}
          onRedraftedTextsChange={handleRedraftedTextsChange}
          onRedraftReviewStatesChange={handleRedraftReviewStatesChange}
          homeSummaryLoading={homeSummaryLoading}
          homeSummaryReady={homeSummaryReady}
          handleHomeSummaryClick={handleHomeSummaryClick}
          selectedText={selectedText}
          setCommentDraft={setCommentDraft}
          isExplaining={isExplaining}
          handleExplain={handleExplain}
          setRedraftContent={setRedraftContent}
          setIsRedraftModalVisible={setIsRedraftModalVisible}
          setIsBrainstormModalVisible={setIsBrainstormModalVisible}
          setBrainstormMessages={setBrainstormMessages}
          explanation={explanation}
          setExplanation={setExplanation}
          setGeneratedRedraft={setGeneratedRedraft}
          handleAcceptRedraft={handleAcceptRedraft}
          commentDraft={commentDraft}
          handleAddComment={handleAddComment}
          isAddingComment={isAddingComment}
          isLoadingParties={isLoadingParties}
          parties={parties}
          clauseAnalysisCounts={clauseAnalysisCounts}
          handleRedraft={handleRedraft}
          redraftTextAreaRef={redraftTextAreaRef}
          isBrainstormModalVisible={isBrainstormModalVisible}
          brainstormMessages={brainstormMessages}
          brainstormLoading={brainstormLoading}
          handleBrainstormSubmit={handleBrainstormSubmit}
        />
      </Content>
    </Layout>
  );
};

export default AppContent;
