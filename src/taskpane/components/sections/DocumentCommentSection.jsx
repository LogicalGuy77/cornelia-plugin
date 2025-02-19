import React from "react";
import PropTypes from "prop-types";
import CommentListView from "../views/CommentListView";

const DocumentCommentSection = ({
  comments,
  setComments,
  initialResolvedComments,
  onCommentUpdate,
}) => {
  return (
    <div className="flex-1 px-4 min-h-0">
      <div className="bg-gray-50 rounded-xl p-4 h-full border border-gray-100">
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Document Comments
        </h3>
        <div className="comments-scroll-container">
          <CommentListView
            comments={comments}
            setComments={setComments}
            initialResolvedComments={initialResolvedComments}
            onCommentUpdate={onCommentUpdate}
          />
        </div>
      </div>
    </div>
  );
};

DocumentCommentSection.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      resolved: PropTypes.bool,
    })
  ).isRequired,
  setComments: PropTypes.func.isRequired,
  initialResolvedComments: PropTypes.arrayOf(PropTypes.string),
  onCommentUpdate: PropTypes.func.isRequired,
};

DocumentCommentSection.defaultProps = {
  initialResolvedComments: [],
};

export default DocumentCommentSection;
