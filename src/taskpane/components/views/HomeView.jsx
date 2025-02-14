import React from "react";
import { Button, Typography, Spin, Select, Tag, Modal, Input } from "antd";
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
import { analyzeDocumentClauses } from "../../../api";

const { TextArea } = Input;
const { Text } = Typography;

const HomeView = ({
  homeSummaryLoading,
  summaryProgress,
  homeSummaryReady,
  handleHomeSummaryClick,
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
}) => {
  return (
    <div className="flex flex-col h-full space-y-4 py-4">
      {/* Summary & Chat Card */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {/* Summary Section */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 m-0">
                    Summary
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Overview your document
                  </p>
                </div>
                <Button
                  type="primary"
                  className="flex items-center gap-1.5 !px-4 !h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-sm"
                  icon={<FileSearchOutlined />}
                  onClick={handleHomeSummaryClick}
                  loading={homeSummaryLoading}
                >
                  {homeSummaryLoading
                    ? `${
                        summaryProgress > 0 ? `${summaryProgress}%` : "Loading"
                      }`
                    : homeSummaryReady
                    ? "View"
                    : "View"}
                </Button>
              </div>
            </div>

            {/* Chat Section */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 m-0">
                    Ask Cornelia
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Get instant answers
                  </p>
                </div>
                <Button
                  type="primary"
                  className="flex items-center gap-1.5 !px-4 !h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-sm"
                  icon={<MessageOutlined />}
                  onClick={() => setActiveView("chat")}
                >
                  Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Panel Card */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all duration-200">
          <div className="flex flex-wrap gap-2">
            <Button
              type="default"
              icon={<CommentOutlined />}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 !px-4 !h-9"
              disabled={!selectedText}
              onClick={() => {
                setCommentDraft({
                  text: "",
                  timestamp: new Date().toISOString(),
                });
              }}
            >
              Comment
            </Button>
            <Button
              type="default"
              icon={<InfoCircleOutlined />}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 !px-4 !h-9"
              disabled={!selectedText}
              loading={isExplaining}
              onClick={handleExplain}
            >
              {isExplaining ? "Explaining..." : "Explain"}
            </Button>
            <Button
              type="default"
              icon={<EditOutlined />}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 !px-4 !h-9"
              disabled={!selectedText}
              loading={generatingRedrafts.get(selectedText)}
              onClick={() => {
                setRedraftContent("");
                setIsRedraftModalVisible(true);
              }}
            >
              {generatingRedrafts.get(selectedText)
                ? "Redrafting..."
                : "Redraft"}
            </Button>
            <Button
              type="default"
              icon={<BulbOutlined />}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 !px-4 !h-9"
              disabled={!selectedText}
              onClick={() => {
                setIsBrainstormModalVisible(true);
                setBrainstormMessages([]);
              }}
            >
              Brainstorm
            </Button>
          </div>
        </div>
      </div>

      {/* Explanation Preview Card */}
      {explanation && (
        <div className="px-4 mt-2">
          <div className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Text type="secondary" className="text-xs">
                  Explanation
                </Text>
                <Button
                  type="text"
                  size="small"
                  className="!text-gray-400 hover:!text-gray-600"
                  icon={<CloseOutlined />}
                  onClick={() => setExplanation(null)}
                />
              </div>

              <div className="bg-white rounded p-3 border border-gray-100">
                <div className="mt-1 text-sm border-l-2 border-green-400 pl-3">
                  {explanation.explanation}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redraft Preview Card */}
      {generatedRedraft && (
        <div className="px-4 mt-2">
          <div className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Text type="secondary" className="text-xs">
                  Redraft Suggestion
                </Text>
                <Button
                  type="text"
                  size="small"
                  className="!text-gray-400 hover:!text-gray-600"
                  icon={<CloseOutlined />}
                  onClick={() => setGeneratedRedraft(null)}
                />
              </div>

              <div className="bg-white rounded p-3 border border-gray-100">
                <div className="mt-1 text-sm border-l-2 border-green-400 pl-3">
                  {generatedRedraft.redraftedText}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  size="small"
                  type="text"
                  className="text-gray-500 hover:text-gray-700"
                  icon={<RedoOutlined />}
                  onClick={() => {
                    setRedraftContent(""); // Clear previous instructions
                    setIsRedraftModalVisible(true); // Show instructions modal
                  }}
                >
                  Regenerate
                </Button>
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={handleAcceptRedraft}
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comment Preview Card */}
      {commentDraft && (
        <div className="px-4 mt-2">
          <div className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Text type="secondary" className="text-xs">
                  New Comment
                </Text>
                <Button
                  type="text"
                  size="small"
                  className="!text-gray-400 hover:!text-gray-600"
                  icon={<CloseOutlined />}
                  onClick={() => setCommentDraft(null)}
                />
              </div>

              <div className="bg-white rounded p-3 border border-gray-100">
                <TextArea
                  value={commentDraft.text}
                  onChange={(e) =>
                    setCommentDraft((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (commentDraft.text.trim()) {
                        handleAddComment();
                      }
                    }
                  }}
                  placeholder="Type your comment here..."
                  autoFocus
                  className="mt-2 border-none focus:shadow-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  loading={isAddingComment}
                  disabled={!commentDraft.text.trim()}
                  onClick={handleAddComment}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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

                          // const parsedResult = HARDCODED_ANALYSIS;

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
      <div className="flex-1 px-4 min-h-0">
        <div className="bg-gray-50 rounded-xl p-4 h-full border border-gray-100">
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Document Comments
          </h3>
          <div className="comments-scroll-container">
            <CommentList
              comments={comments}
              setComments={setComments}
              initialResolvedComments={initialResolvedComments}
              onCommentUpdate={handleCommentUpdate}
            />
          </div>
        </div>
      </div>

      {/* Redraft Instructions Modal */}
      <Modal
        title={
          <div className="modal-title">
            <EditOutlined className="modal-icon" />
            <span>Redraft with Cornelia</span>
          </div>
        }
        open={isRedraftModalVisible}
        onCancel={() => {
          setIsRedraftModalVisible(false);
          setRedraftContent("");
        }}
        footer={
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setIsRedraftModalVisible(false);
              handleRedraft();
            }}
          >
            Redraft
          </Button>
        }
        width={360}
        className="redraft-modal"
        closeIcon={null}
      >
        <TextArea
          ref={redraftTextAreaRef}
          rows={5}
          value={redraftContent}
          onChange={(e) => setRedraftContent(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setIsRedraftModalVisible(false);
              handleRedraft();
            }
          }}
          placeholder="Give instructions for your redraft..."
          className="redraft-textarea"
          autoFocus
        />
      </Modal>

      {/* Add this modal near other modals */}
      <Modal
        title={
          <div className="modal-title text-sm sm:text-base">
            <BulbOutlined className="modal-icon text-purple-500" />
            <span>Brainstorm Solutions</span>
          </div>
        }
        open={isBrainstormModalVisible}
        onCancel={() => {
          setIsBrainstormModalVisible(false);
          setBrainstormMessages([]);
        }}
        footer={null}
        width="90vw"
        className="sm:max-w-[800px] brainstorm-modal"
      >
        <div className="flex flex-col h-[600px]">
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <Text strong>Selected Text:</Text>
            <div className="mt-2">{selectedText}</div>
          </div>
          <div className="flex-1 border rounded-lg overflow-hidden">
            <ChatWindow
              documentContent={documentContent}
              messages={brainstormMessages}
              setMessages={setBrainstormMessages}
              isLoading={brainstormLoading}
              onSubmit={handleBrainstormSubmit}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomeView;
