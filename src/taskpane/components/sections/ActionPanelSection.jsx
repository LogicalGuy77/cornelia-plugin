import React from "react";
import { Button } from "antd";
import {
  CommentOutlined,
  InfoCircleOutlined,
  EditOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

const ActionPanelSection = ({
  selectedText,
  isExplaining,
  generatingRedrafts,
  handleExplain,
  setCommentDraft,
  setRedraftContent,
  setIsRedraftModalVisible,
  setIsBrainstormModalVisible,
  setBrainstormMessages,
}) => {
  return (
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
            {generatingRedrafts.get(selectedText) ? "Redrafting..." : "Redraft"}
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
  );
};

ActionPanelSection.propTypes = {
  selectedText: PropTypes.string,
  isExplaining: PropTypes.bool,
  generatingRedrafts: PropTypes.instanceOf(Map),
  handleExplain: PropTypes.func.isRequired,
  setCommentDraft: PropTypes.func.isRequired,
  setRedraftContent: PropTypes.func.isRequired,
  setIsRedraftModalVisible: PropTypes.func.isRequired,
  setIsBrainstormModalVisible: PropTypes.func.isRequired,
  setBrainstormMessages: PropTypes.func.isRequired,
};

ActionPanelSection.defaultProps = {
  selectedText: "",
  isExplaining: false,
  generatingRedrafts: new Map(),
};

export default ActionPanelSection;
