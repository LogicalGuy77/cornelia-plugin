import React from "react";
import { Button, Typography, Input } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { TextArea } = Input;
const { Text } = Typography;

const CommentPreview = ({
  comment,
  onClose,
  onChange,
  onSubmit,
  isLoading,
}) => {
  if (!comment) return null;

  return (
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
              onClick={onClose}
            />
          </div>
          <div className="bg-white rounded p-3 border border-gray-100">
            <TextArea
              value={comment.text}
              onChange={onChange}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (comment.text.trim()) {
                    onSubmit();
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
              loading={isLoading}
              disabled={!comment.text.trim()}
              onClick={onSubmit}
            >
              Add Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

CommentPreview.propTypes = {
  comment: PropTypes.shape({
    text: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default CommentPreview;
