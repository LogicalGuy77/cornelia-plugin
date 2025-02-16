import React from "react";
import DocumentSummary from "./views/DocumentSummaryView";
import CommentList from "./views/CommentListView";
import ChatWindow from "./views/ChatWindowView";
import AnalysisView from "./views/AnalysisView";
import HomeView from "./views/HomeView";

const MainContent = ({
  activeView,
  // Summary view props
  documentContent,
  summary,
  summaryLoading,
  summaryProgress,
  summaryError,
  handleGenerateSummary,
  // Comment list props
  comments,
  setComments,
  initialResolvedComments,
  handleCommentUpdate,
  // Chat window props
  chatMessages,
  setChatMessages,
  chatLoading,
  chatError,
  handleChatSubmit,
  // Analysis view props
  clauseAnalysisLoading,
  selectedParty,
  clauseAnalysis,
  setActiveView,
  getTagColor,
  handleChangeParty,
  isRedraftModalVisible,
  redraftContent,
  selectedClause,
  generatedRedraft,
  generatingRedrafts,
  redraftedClauses,
  redraftedTexts,
  redraftReviewStates,
  onRedraftModalVisibility,
  onRedraftContentChange,
  onSelectedClauseChange,
  onGeneratingRedraftsChange,
  onRedraftedClausesChange,
  onRedraftedTextsChange,
  onRedraftReviewStatesChange,
  // Home view props
  homeSummaryLoading,
  homeSummaryReady,
  handleHomeSummaryClick,
  selectedText,
  setCommentDraft,
  isExplaining,
  handleExplain,
  setRedraftContent,
  setIsRedraftModalVisible,
  setIsBrainstormModalVisible,
  setBrainstormMessages,
  explanation,
  setExplanation,
  setGeneratedRedraft,
  handleAcceptRedraft,
  commentDraft,
  handleAddComment,
  isAddingComment,
  isLoadingParties,
  parties,
  clauseAnalysisCounts,
  handleRedraft,
  redraftTextAreaRef,
  isBrainstormModalVisible,
  brainstormMessages,
  brainstormLoading,
  handleBrainstormSubmit,
}) => {
  switch (activeView) {
    case "summary":
      return (
        <DocumentSummary
          documentContent={documentContent}
          summary={summary}
          isLoading={summaryLoading}
          progress={summaryProgress}
          error={summaryError}
          onGenerateSummary={handleGenerateSummary}
          setActiveView={setActiveView}
        />
      );

    case "comments":
      return (
        <CommentList
          comments={comments}
          setComments={setComments}
          initialResolvedComments={initialResolvedComments}
          onCommentUpdate={handleCommentUpdate}
        />
      );

    case "chat":
      return (
        <ChatWindow
          documentContent={documentContent}
          messages={chatMessages}
          setMessages={setChatMessages}
          isLoading={chatLoading}
          error={chatError}
          onSubmit={handleChatSubmit}
        />
      );

    case "analysis":
      return (
        <AnalysisView
          clauseAnalysisLoading={clauseAnalysisLoading}
          selectedParty={selectedParty}
          clauseAnalysis={clauseAnalysis}
          setActiveView={setActiveView}
          getTagColor={getTagColor}
          onChangeParty={handleChangeParty}
          isRedraftModalVisible={isRedraftModalVisible}
          redraftContent={redraftContent}
          selectedClause={selectedClause}
          generatedRedraft={generatedRedraft}
          generatingRedrafts={generatingRedrafts}
          redraftedClauses={redraftedClauses}
          redraftedTexts={redraftedTexts}
          redraftReviewStates={redraftReviewStates}
          onRedraftModalVisibility={onRedraftModalVisibility}
          onRedraftContentChange={onRedraftContentChange}
          onSelectedClauseChange={onSelectedClauseChange}
          onGeneratingRedraftsChange={onGeneratingRedraftsChange}
          onRedraftedClausesChange={onRedraftedClausesChange}
          onRedraftedTextsChange={onRedraftedTextsChange}
          onRedraftReviewStatesChange={onRedraftReviewStatesChange}
        />
      );

    default:
      return (
        <HomeView
          homeSummaryLoading={homeSummaryLoading}
          summaryProgress={summaryProgress}
          homeSummaryReady={homeSummaryReady}
          handleHomeSummaryClick={handleHomeSummaryClick}
          setActiveView={setActiveView}
          selectedText={selectedText}
          setCommentDraft={setCommentDraft}
          isExplaining={isExplaining}
          handleExplain={handleExplain}
          generatingRedrafts={generatingRedrafts}
          setRedraftContent={setRedraftContent}
          setIsRedraftModalVisible={setIsRedraftModalVisible}
          setIsBrainstormModalVisible={setIsBrainstormModalVisible}
          setBrainstormMessages={setBrainstormMessages}
          explanation={explanation}
          setExplanation={setExplanation}
          generatedRedraft={generatedRedraft}
          setGeneratedRedraft={setGeneratedRedraft}
          handleAcceptRedraft={handleAcceptRedraft}
          commentDraft={commentDraft}
          handleAddComment={handleAddComment}
          isAddingComment={isAddingComment}
          clauseAnalysis={clauseAnalysis}
          isLoadingParties={isLoadingParties}
          clauseAnalysisLoading={clauseAnalysisLoading}
          parties={parties}
          getTagColor={getTagColor}
          selectedParty={selectedParty}
          clauseAnalysisCounts={clauseAnalysisCounts}
          comments={comments}
          setComments={setComments}
          initialResolvedComments={initialResolvedComments}
          handleCommentUpdate={handleCommentUpdate}
          isRedraftModalVisible={isRedraftModalVisible}
          redraftContent={redraftContent}
          handleRedraft={handleRedraft}
          redraftTextAreaRef={redraftTextAreaRef}
          isBrainstormModalVisible={isBrainstormModalVisible}
          brainstormMessages={brainstormMessages}
          brainstormLoading={brainstormLoading}
          handleBrainstormSubmit={handleBrainstormSubmit}
          documentContent={documentContent}
        />
      );
  }
};

export default MainContent;
