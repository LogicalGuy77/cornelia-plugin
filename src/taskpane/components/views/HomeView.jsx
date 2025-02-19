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
  FileSearchOutlined,
  MessageOutlined,
  CommentOutlined,
  InfoCircleOutlined,
  EditOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  RedoOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import CommentList from "./CommentListView";
import ChatWindow from "./ChatWindowView";
import {
  SummarySection,
  ChatSection,
  ActionPanelSection,
  DocumentCommentSection,
  AnalysisCard,
} from "../sections";
import {
  ExplanationPreview,
  RedraftPreview,
  CommentPreview,
} from "../previews";
import { RedraftModal, BrainStormModal } from "../modals";
import { analyzeDocumentClauses } from "../../../api";
import { HARDCODED_ANALYSIS } from "../constants/analysisData";

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
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all duration-200">
          <div className="flex flex-col custom-flex-row items-center justify-between gap-4">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 m-0">
                  Clause Analysis
                </h3>

                {/* Only show party selection if we don't have analysis results */}
                {!clauseAnalysis &&
                  (isLoadingParties ? (
                    <Button loading className="w-[200px]">
                      Analyzing Parties...
                    </Button>
                  ) : clauseAnalysisLoading ? (
                    <div className="flex items-center gap-2">
                      <Spin />
                      <span className="text-gray-600">
                        Analyzing document...
                      </span>
                    </div>
                  ) : (
                    <Select
                      placeholder="Select a party"
                      style={{ width: 300 }}
                      options={parties?.map((party) => ({
                        value: party.name,
                        label: (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              width: "100%",
                              maxWidth: "280px", // Leave some space for the dropdown arrow
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 500,
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                lineHeight: "1.4",
                              }}
                            >
                              {party.name}
                            </span>
                            <Tag
                              color={getTagColor(party.role)}
                              style={{
                                maxWidth: "100%",
                                whiteSpace: "normal",
                                height: "auto",
                                padding: "2px 8px",
                                lineHeight: "1.4",
                              }}
                            >
                              {party.role || "Unknown Role"}
                            </Tag>
                          </div>
                        ),
                      }))}
                      listItemHeight={80} // Increase height for wrapped content
                      listHeight={400} // Increase dropdown height
                      optionRender={(option) => (
                        <div
                          style={{
                            padding: "8px",
                            width: "100%",
                            wordBreak: "break-word",
                          }}
                        >
                          {option.data.label}
                        </div>
                      )}
                      onChange={async (value) => {
                        const selectedParty = parties.find(
                          (p) => p.name === value
                        );
                        setSelectedParty(selectedParty);
                        try {
                          setClauseAnalysisLoading(true);
                          const result = await analyzeDocumentClauses(
                            documentContent,
                            {
                              name: selectedParty.name,
                              role: selectedParty.role,
                            }
                          );

                          // If result is null or undefined, throw error
                          if (!result) {
                            throw new Error("No analysis results received");
                          }

                          // Handle different result types
                          let parsedResult;
                          if (typeof result === "string") {
                            try {
                              parsedResult = JSON.parse(result);
                            } catch (parseError) {
                              logger.error("JSON Parse error:", {
                                error: parseError,
                                result: result?.substring(0, 100), // Log first 100 chars
                              });
                              throw new Error("Invalid JSON response");
                            }
                          } else if (typeof result === "object") {
                            parsedResult = result;
                          } else {
                            throw new Error("Unexpected result type");
                          }

                          // Validate structure
                          if (
                            !parsedResult ||
                            !parsedResult.acceptable ||
                            !parsedResult.risky ||
                            !parsedResult.missing
                          ) {
                            throw new Error(
                              "Invalid analysis result structure"
                            );
                          }

                          parsedResult = HARDCODED_ANALYSIS;

                          // Store the parsed result
                          setClauseAnalysis(parsedResult);

                          // Set counts
                          setClauseAnalysisCounts({
                            acceptable: parsedResult.acceptable.length || 0,
                            risky: parsedResult.risky.length || 0,
                            missing: parsedResult.missing.length || 0,
                          });
                        } catch (error) {
                          logger.error("Clause analysis failed:", error);
                          message.error(`Analysis failed: ${error.message}`);
                          setClauseAnalysis(null);
                        } finally {
                          setClauseAnalysisLoading(false);
                        }
                      }}
                    />
                  ))}

                {/* Show View Analysis button if we have analysis results */}
                {selectedParty && clauseAnalysis && !clauseAnalysisLoading && (
                  <Button
                    type="primary"
                    className="!bg-green-600 !hover:bg-green-700 !border-green-600 !text-white !px-6 !h-9 !text-sm !font-medium"
                    icon={<FileSearchOutlined className="text-lg" />}
                    onClick={() => setActiveView("analysis")}
                  >
                    View Analysis
                  </Button>
                )}
              </div>

              {/* Show analysis counts */}
              {selectedParty && clauseAnalysis && !clauseAnalysisLoading && (
                <div className="flex items-center gap-6 mb-4">
                  {/* Acceptable */}
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-md text-green-600" />
                    <div>
                      <span className="text-lg font-semibold text-green-600">
                        {clauseAnalysisCounts.acceptable}
                      </span>
                      <div className="text-sm text-green-600">Acceptable</div>
                    </div>
                  </div>

                  {/* Risky */}
                  <div className="flex items-center gap-2">
                    <WarningOutlined className="text-md text-yellow-600" />
                    <div>
                      <span className="text-lg font-semibold text-yellow-600">
                        {clauseAnalysisCounts.risky}
                      </span>
                      <div className="text-sm text-yellow-600">Review</div>
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="flex items-center gap-2">
                    <ExclamationCircleOutlined className="text-md text-red-600" />
                    <div>
                      <span className="text-lg font-semibold text-red-600">
                        {clauseAnalysisCounts.missing}
                      </span>
                      <div className="text-sm text-red-600">Missing</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
