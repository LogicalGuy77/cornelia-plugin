import React from "react";
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const ChatSection = ({ setActiveView }) => {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 m-0">
            Ask Cornelia
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Get instant answers</p>
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
  );
};

ChatSection.propTypes = {
  setActiveView: PropTypes.func.isRequired,
};

ChatSection.displayName = "ChatSection";

export default ChatSection;
