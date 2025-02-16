import React from "react";
import { Modal, Button, Input } from "antd";
import { EditOutlined, CheckCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { TextArea } = Input;

const RedraftModal = ({
  isVisible,
  onClose,
  onRedraft,
  redraftContent,
  setRedraftContent,
  redraftTextAreaRef,
}) => {
  return (
    <Modal
      title={
        <div className="modal-title">
          <EditOutlined className="modal-icon" />
          <span>Redraft with Cornelia</span>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={onRedraft}
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
            onRedraft();
          }
        }}
        placeholder="Give instructions for your redraft..."
        className="redraft-textarea"
        autoFocus
      />
    </Modal>
  );
};

RedraftModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRedraft: PropTypes.func.isRequired,
  redraftContent: PropTypes.string.isRequired,
  setRedraftContent: PropTypes.func.isRequired,
  redraftTextAreaRef: PropTypes.object.isRequired,
};

export default RedraftModal;
