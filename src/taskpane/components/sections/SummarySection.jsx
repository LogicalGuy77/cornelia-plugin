import React from "react";
import { Button, Typography } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Text } = Typography;

const SummarySection = ({
  homeSummaryLoading,
  summaryProgress,
  homeSummaryReady,
  handleHomeSummaryClick,
  setActiveView,
}) => {
  const handleClick = async () => {
    if (!homeSummaryReady) {
      await handleHomeSummaryClick(); // Fetch summary if not ready
    }
    setActiveView("summary");
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 m-0">Summary</h3>
          <p className="text-xs text-gray-500 mt-0.5">Overview your document</p>
        </div>
        <Button
          type="primary"
          className="flex items-center gap-1.5 !px-4 !h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-sm"
          icon={<FileSearchOutlined />}
          onClick={handleClick}
          loading={homeSummaryLoading}
        >
          {homeSummaryLoading
            ? `${summaryProgress > 0 ? `${summaryProgress}%` : "Loading"}`
            : homeSummaryReady
            ? "View"
            : "Generate"}
        </Button>
      </div>
    </div>
  );
};

SummarySection.propTypes = {
  homeSummaryLoading: PropTypes.bool.isRequired,
  summaryProgress: PropTypes.number,
  homeSummaryReady: PropTypes.bool.isRequired,
  handleHomeSummaryClick: PropTypes.func.isRequired,
  setActiveView: PropTypes.func.isRequired,
};

SummarySection.defaultProps = {
  summaryProgress: 0,
};

SummarySection.displayName = "SummarySection";

export default SummarySection;
