import { useState, useRef, useLayoutEffect } from "react";

export const useAppState = () => {
  const [activeView, setActiveView] = useState(null);
  const [clauseAnalysis, setClauseAnalysis] = useState(null);
  const [clauseAnalysisLoading, setClauseAnalysisLoading] = useState(false);
  const [clauseAnalysisCounts, setClauseAnalysisCounts] = useState({
    acceptable: 0,
    risky: 0,
    missing: 0,
  });

  const redraftTextAreaRef = useRef(null);

  // Redraft related states
  const [isRedraftModalVisible, setIsRedraftModalVisible] = useState(false);
  const [redraftContent, setRedraftContent] = useState("");
  const [selectedClause, setSelectedClause] = useState(null);
  const [generatedRedraft, setGeneratedRedraft] = useState(null);
  const [generatingRedrafts, setGeneratingRedrafts] = useState(new Map());
  const [redraftedClauses, setRedraftedClauses] = useState(new Set());
  const [redraftedTexts, setRedraftedTexts] = useState(new Map());
  const [redraftReviewStates, setRedraftReviewStates] = useState(new Map());

  // Explanation states
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState(null);

  // Comment states
  const [commentDraft, setCommentDraft] = useState(null);
  const [isAddingComment, setIsAddingComment] = useState(false);

  useLayoutEffect(() => {
    if (isRedraftModalVisible && redraftTextAreaRef.current) {
      redraftTextAreaRef.current.focus();
    }
  }, [isRedraftModalVisible]);

  return {
    // View state
    activeView,
    setActiveView,

    // Clause analysis states
    clauseAnalysis,
    setClauseAnalysis,
    clauseAnalysisLoading,
    setClauseAnalysisLoading,
    clauseAnalysisCounts,
    setClauseAnalysisCounts,

    // Redraft states
    isRedraftModalVisible,
    setIsRedraftModalVisible,
    redraftContent,
    setRedraftContent,
    selectedClause,
    setSelectedClause,
    generatedRedraft,
    setGeneratedRedraft,
    generatingRedrafts,
    setGeneratingRedrafts,
    redraftedClauses,
    setRedraftedClauses,
    redraftedTexts,
    setRedraftedTexts,
    redraftReviewStates,
    setRedraftReviewStates,

    // Explanation states
    isExplaining,
    setIsExplaining,
    explanation,
    setExplanation,

    // Comment states
    commentDraft,
    setCommentDraft,
    isAddingComment,
    setIsAddingComment,
    redraftTextAreaRef,
  };
};
