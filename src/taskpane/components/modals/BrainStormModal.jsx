import React from "react";
import { Modal, Typography } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import ChatWindow from "../views/ChatWindowView";

const { Text } = Typography;

const BrainstormModal = ({
  isVisible,
  onClose,
  selectedText,
  documentContent,
  brainstormMessages,
  setBrainstormMessages,
  brainstormLoading,
  handleBrainstormSubmit,
}) => {
  return (
    <Modal
      title={
        <div className="modal-title text-sm sm:text-base">
          <BulbOutlined className="modal-icon text-purple-500" />
          <span>Brainstorm Solutions</span>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
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
  );
};

BrainstormModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedText: PropTypes.string.isRequired,
  documentContent: PropTypes.string.isRequired,
  brainstormMessages: PropTypes.array.isRequired,
  setBrainstormMessages: PropTypes.func.isRequired,
  brainstormLoading: PropTypes.bool.isRequired,
  handleBrainstormSubmit: PropTypes.func.isRequired,
};

export default BrainstormModal;
