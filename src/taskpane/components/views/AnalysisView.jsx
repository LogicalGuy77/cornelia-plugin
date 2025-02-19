import React from "react";
import { Spin, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ClauseAnalysis from "../previews/ClauseAnalysis";

const { Text } = Typography;

const AnalysisView = ({
  // Loading and party state
  clauseAnalysisLoading,
  selectedParty,
  setSelectedParty,
  clauseAnalysis,
  setClauseAnalysis,
  setActiveView,
  getTagColor,
  onChangeParty,

  // Redraft modal props
  isRedraftModalVisible,
  redraftContent,
  selectedClause,
  generatedRedraft,
  generatingRedrafts,

  // Redraft state props
  redraftedClauses,
  redraftedTexts,
  redraftReviewStates,

  // Redraft handlers
  onRedraftModalVisibility,
  onRedraftContentChange,
  onSelectedClauseChange,
  onGeneratingRedraftsChange,
  onRedraftedClausesChange,
  onRedraftedTextsChange,
  onRedraftReviewStatesChange,
}) => {
  return (
    <div className="p-4">
      {clauseAnalysisLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Spin size="large" />
          <Text className="mt-4">Analyzing document...</Text>
        </div>
      ) : !selectedParty || !clauseAnalysis ? (
        <div className="flex flex-col items-center justify-center">
          <Text className="mb-4">
            Please select a party from the home screen to start analysis
          </Text>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => setActiveView(null)}
          >
            Return to Home
          </Button>
        </div>
      ) : (
        <ClauseAnalysis
          results={clauseAnalysis}
          loading={clauseAnalysisLoading}
          selectedParty={selectedParty}
          getTagColor={getTagColor}
          onChangeParty={onChangeParty}
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
      )}
    </div>
  );
};

export default AnalysisView;
