import React from "react";
import { Button, Spin, Select, Tag, message } from "antd";
import {
  FileSearchOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { analyzeDocumentClauses } from "../../../api";
import { HARDCODED_ANALYSIS } from "../constants/analysisData";
import { logger } from "../../../api";

const ClauseAnalysisSection = ({
  clauseAnalysis,
  isLoadingParties,
  clauseAnalysisLoading,
  parties,
  getTagColor,
  selectedParty,
  setSelectedParty,
  setClauseAnalysisLoading,
  setClauseAnalysis,
  setClauseAnalysisCounts,
  clauseAnalysisCounts,
  setActiveView,
  documentContent,
}) => {
  const renderPartyOption = (party) => ({
    value: party.name,
    label: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: "100%",
          maxWidth: "280px",
        }}
      >
        <span
          style={{
            fontWeight: 500,
            wordWrap: "break-word",
            whiteSpace: "normal",
            lineHeight: "1.4",
          }}
        >
          {party.name}
        </span>
        <Tag
          color={getTagColor(party.role)}
          style={{
            maxWidth: "100%",
            whiteSpace: "normal",
            height: "auto",
            padding: "2px 8px",
            lineHeight: "1.4",
          }}
        >
          {party.role || "Unknown Role"}
        </Tag>
      </div>
    ),
  });

  const handlePartySelect = async (value) => {
    const selectedParty = parties.find((p) => p.name === value);
    setSelectedParty(selectedParty);

    try {
      setClauseAnalysisLoading(true);
      const result = await analyzeDocumentClauses(documentContent, {
        name: selectedParty.name,
        role: selectedParty.role,
      });

      if (!result) {
        throw new Error("No analysis results received");
      }

      let parsedResult;
      if (typeof result === "string") {
        try {
          parsedResult = JSON.parse(result);
        } catch (parseError) {
          logger.error("JSON Parse error:", {
            error: parseError,
            result: result?.substring(0, 100),
          });
          throw new Error("Invalid JSON response");
        }
      } else if (typeof result === "object") {
        parsedResult = result;
      } else {
        throw new Error("Unexpected result type");
      }

      if (
        !parsedResult?.acceptable ||
        !parsedResult?.risky ||
        !parsedResult?.missing
      ) {
        throw new Error("Invalid analysis result structure");
      }

      // parsedResult = HARDCODED_ANALYSIS;
      setClauseAnalysis(parsedResult);
      setClauseAnalysisCounts({
        acceptable: parsedResult.acceptable.length || 0,
        risky: parsedResult.risky.length || 0,
        missing: parsedResult.missing.length || 0,
      });
    } catch (error) {
      logger.error("Clause analysis failed:", error);
      message.error(`Analysis failed: ${error.message}`);
      setClauseAnalysis(null);
    } finally {
      setClauseAnalysisLoading(false);
    }
  };

  const renderAnalysisCount = ({ icon, count, label, color }) => (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <span className={`text-lg font-semibold text-${color}-600`}>
          {count}
        </span>
        <div className={`text-sm text-${color}-600`}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className="px-4">
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all duration-200">
        <div className="flex flex-col custom-flex-row items-center justify-between gap-4">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 m-0">
                Clause Analysis
              </h3>

              {!clauseAnalysis ? (
                isLoadingParties ? (
                  <Button loading className="w-[200px]">
                    Analyzing Parties...
                  </Button>
                ) : clauseAnalysisLoading ? (
                  <div className="flex items-center gap-2">
                    <Spin />
                    <span className="text-gray-600">Analyzing document...</span>
                  </div>
                ) : (
                  <Select
                    placeholder="Select a party"
                    style={{ width: 300 }}
                    options={parties?.map(renderPartyOption)}
                    listItemHeight={80}
                    listHeight={400}
                    optionRender={(option) => (
                      <div
                        style={{
                          padding: "8px",
                          width: "100%",
                          wordBreak: "break-word",
                        }}
                      >
                        {option.data.label}
                      </div>
                    )}
                    onChange={handlePartySelect}
                  />
                )
              ) : null}

              {selectedParty && clauseAnalysis && !clauseAnalysisLoading && (
                <Button
                  type="primary"
                  className="!bg-green-600 !hover:bg-green-700 !border-green-600 !text-white !px-6 !h-9 !text-sm !font-medium"
                  icon={<FileSearchOutlined className="text-lg" />}
                  onClick={() => setActiveView("analysis")}
                >
                  View Analysis
                </Button>
              )}
            </div>

            {selectedParty && clauseAnalysis && !clauseAnalysisLoading && (
              <div className="flex items-center gap-6 mb-4">
                {renderAnalysisCount({
                  icon: (
                    <CheckCircleOutlined className="text-md text-green-600" />
                  ),
                  count: clauseAnalysisCounts.acceptable,
                  label: "Acceptable",
                  color: "green",
                })}
                {renderAnalysisCount({
                  icon: <WarningOutlined className="text-md text-yellow-600" />,
                  count: clauseAnalysisCounts.risky,
                  label: "Review",
                  color: "yellow",
                })}
                {renderAnalysisCount({
                  icon: (
                    <ExclamationCircleOutlined className="text-md text-red-600" />
                  ),
                  count: clauseAnalysisCounts.missing,
                  label: "Missing",
                  color: "red",
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClauseAnalysisSection;
