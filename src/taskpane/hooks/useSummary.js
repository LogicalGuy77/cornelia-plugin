import { useState } from "react";
import { performAnalysis } from "../../api";

export const useSummary = (documentContent) => {
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryProgress, setSummaryProgress] = useState(0);
  const [summaryError, setSummaryError] = useState(null);
  const [homeSummaryLoading, setHomeSummaryLoading] = useState(false);
  const [homeSummaryReady, setHomeSummaryReady] = useState(false);

  // Common function for generating summary
  const generateSummary = async (setLoading, setReady = () => {}) => {
    if (!documentContent) {
      setSummaryError("Please read the document first");
      return;
    }

    setLoading(true);
    setSummaryError(null);
    try {
      const result = await performAnalysis(
        "shortSummary",
        documentContent,
        "document",
        (fileName, percent) => {
          setSummaryProgress(percent);
        }
      );

      if (result) {
        setSummary(result);
        setReady(true);
      } else {
        throw new Error("No result received from analysis");
      }
    } catch (error) {
      setSummaryError(error.message || "Analysis failed");
    } finally {
      setLoading(false);
      setSummaryProgress(0);
    }
  };

  const handleGenerateSummary = () => {
    generateSummary(setSummaryLoading);
  };

  const handleHomeSummaryClick = () => {
    if (homeSummaryReady) return;

    generateSummary(setHomeSummaryLoading, () => setHomeSummaryReady(true));
  };

  return {
    summary,
    summaryLoading,
    summaryProgress,
    summaryError,
    homeSummaryLoading,
    homeSummaryReady,
    handleGenerateSummary,
    handleHomeSummaryClick,
  };
};
