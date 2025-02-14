import React from "react";
import { Spin, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ClauseAnalysis from "../ClauseAnalysis";

const { Text } = Typography;

const AnalysisView = ({
  clauseAnalysisLoading,
  selectedParty,
  clauseAnalysis,
  setActiveView,
  ...props // All other ClauseAnalysis props
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
          {...props}
        />
      )}
    </div>
  );
};

export default AnalysisView;
