import React from "react";
import {
  Button,
  Typography,
  Spin,
  Select,
  Tag,
  Modal,
  Input,
  message,
} from "antd";
import { logger } from "../../../api";
import {
  SummarySection,
  ChatSection,
  ActionPanelSection,
  DocumentCommentSection,
  ClauseAnalysisSection,
} from "../sections";
import {
  ExplanationPreview,
  RedraftPreview,
  CommentPreview,
} from "../previews";
import { RedraftModal, BrainStormModal } from "../modals";

const { TextArea } = Input;
const { Text } = Typography;

const HomeView = ({
  homeSummaryLoading,
  summaryProgress,
  homeSummaryReady,
  handleHomeSummaryClick,
  summary,
  setActiveView,
  selectedText,
  setCommentDraft,
  isExplaining,
  handleExplain,
  generatingRedrafts,
  setRedraftContent,
  setIsRedraftModalVisible,
  setIsBrainstormModalVisible,
  setBrainstormMessages,
  explanation,
  setExplanation,
  generatedRedraft,
  setGeneratedRedraft,
  handleAcceptRedraft,
  commentDraft,
  handleAddComment,
  isAddingComment,
  clauseAnalysis,
  isLoadingParties,
  clauseAnalysisLoading,
  parties,
  getTagColor,
  selectedParty,
  setSelectedParty,
  setClauseAnalysisLoading,
  setClauseAnalysisCounts,
  clauseAnalysisCounts,
  comments,
  setComments,
  initialResolvedComments,
  handleCommentUpdate,
  isRedraftModalVisible,
  redraftContent,
  handleRedraft,
  redraftTextAreaRef,
  isBrainstormModalVisible,
  brainstormMessages,
  brainstormLoading,
  handleBrainstormSubmit,
  documentContent,
  setClauseAnalysis,
}) => {
  return (
    <div className="flex flex-col h-full space-y-4 py-4">
      {/* Summary & Chat Card */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {/* Summary Section */}
            <SummarySection
              homeSummaryLoading={homeSummaryLoading}
              summaryProgress={summaryProgress}
              homeSummaryReady={homeSummaryReady}
              handleHomeSummaryClick={handleHomeSummaryClick}
              summary={summary}
              setActiveView={setActiveView}
            />
            {/* Chat Section */}
            <ChatSection setActiveView={setActiveView} />
          </div>
        </div>
      </div>

      {/* Actions Panel Card */}
      <ActionPanelSection
        selectedText={selectedText}
        isExplaining={isExplaining}
        generatingRedrafts={generatingRedrafts}
        handleExplain={handleExplain}
        setCommentDraft={setCommentDraft}
        setRedraftContent={setRedraftContent}
        setIsRedraftModalVisible={setIsRedraftModalVisible}
        setIsBrainstormModalVisible={setIsBrainstormModalVisible}
        setBrainstormMessages={setBrainstormMessages}
      />

      {/* Explanation Preview Card */}
      <ExplanationPreview
        explanation={explanation}
        onClose={() => setExplanation(null)}
      />

      <RedraftPreview
        redraft={generatedRedraft}
        onClose={() => setGeneratedRedraft(null)}
        onRegenerate={() => {
          setRedraftContent("");
          setIsRedraftModalVisible(true);
        }}
        onAccept={handleAcceptRedraft}
      />

      <CommentPreview
        comment={commentDraft}
        onClose={() => setCommentDraft(null)}
        onChange={(e) =>
          setCommentDraft((prev) => ({ ...prev, text: e.target.value }))
        }
        onSubmit={handleAddComment}
        isLoading={isAddingComment}
      />

      {/* Analysis Card */}
      <ClauseAnalysisSection
        clauseAnalysis={clauseAnalysis}
        isLoadingParties={isLoadingParties}
        clauseAnalysisLoading={clauseAnalysisLoading}
        parties={parties}
        getTagColor={getTagColor}
        selectedParty={selectedParty}
        setSelectedParty={setSelectedParty}
        setClauseAnalysisLoading={setClauseAnalysisLoading}
        setClauseAnalysis={setClauseAnalysis}
        setClauseAnalysisCounts={setClauseAnalysisCounts}
        clauseAnalysisCounts={clauseAnalysisCounts}
        setActiveView={setActiveView}
        documentContent={documentContent}
      />

      {/* Comments Section */}
      <DocumentCommentSection
        comments={comments}
        setComments={setComments}
        initialResolvedComments={initialResolvedComments}
        onCommentUpdate={handleCommentUpdate}
      />

      {/* Redraft Instructions Modal */}
      <RedraftModal
        isVisible={isRedraftModalVisible}
        onClose={() => {
          setIsRedraftModalVisible(false);
          setRedraftContent("");
        }}
        onRedraft={() => {
          setIsRedraftModalVisible(false);
          handleRedraft();
        }}
        redraftContent={redraftContent}
        setRedraftContent={setRedraftContent}
        redraftTextAreaRef={redraftTextAreaRef}
      />

      {/* Brainstorm Solutions Modal */}
      <BrainStormModal
        isVisible={isBrainstormModalVisible}
        onClose={() => {
          setIsBrainstormModalVisible(false);
          setBrainstormMessages([]);
        }}
        selectedText={selectedText}
        documentContent={documentContent}
        brainstormMessages={brainstormMessages}
        setBrainstormMessages={setBrainstormMessages}
        brainstormLoading={brainstormLoading}
        handleBrainstormSubmit={handleBrainstormSubmit}
      />
    </div>
  );
};

export default HomeView;
