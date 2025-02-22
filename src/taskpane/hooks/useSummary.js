import { useState, useEffect } from "react";
import { performAnalysis } from "../../api";

export const useSummary = (documentContent) => {
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryProgress, setSummaryProgress] = useState(0);
  const [summaryError, setSummaryError] = useState(null);
  const [homeSummaryLoading, setHomeSummaryLoading] = useState(false);
  const [homeSummaryReady, setHomeSummaryReady] = useState(false);

  // useEffect(() => {
  //   console.log("Updated Summary:", summary);
  // }, [summary]);

  // Common function for generating summary
  const generateSummary = async (setLoading, setReady = () => {}) => {
    if (!documentContent) {
      setSummaryError("Please read the document first");
      return;
    }

    setLoading(true);
    setSummaryError(null);
    setSummaryProgress(0);

    try {
      // Start a progress simulation
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        if (simulatedProgress < 90) {
          // Only simulate up to 90%
          simulatedProgress += Math.random() * 10; // Random increment between 0-10
          setSummaryProgress(Math.min(Math.round(simulatedProgress), 90));
        }
      }, 500); // Update every 500ms

      const result = await performAnalysis(
        "shortSummary",
        documentContent,
        "document"
      );

      // Clear the interval and set to 100% when complete
      clearInterval(progressInterval);
      setSummaryProgress(100);

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
      // Don't reset progress to 0 immediately - let it show 100% briefly
      setTimeout(() => setSummaryProgress(0), 500);
    }
  };

  const handleGenerateSummary = () => {
    generateSummary(setSummaryLoading);
  };

  const handleHomeSummaryClick = () => {
    if (homeSummaryReady || summary) return; // Avoid redundant API calls

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
