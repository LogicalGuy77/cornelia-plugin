import { useState, useEffect } from "react";
import { useDocument } from "./useDocument";
import { HARDCODED_PARTIES } from "../components/constants/analysisData";
import { analyzeDocumentClauses } from "../../api";

// Toggle between API and hardcoded values
const USE_HARDCODED = true; // Set to true to use hardcoded values

export const useParties = () => {
  const { documentContent } = useDocument();
  const [parties, setParties] = useState([]);
  const [isLoadingParties, setIsLoadingParties] = useState(true);
  const [selectedParty, setSelectedParty] = useState(null);

  // Function to determine the tag color based on role
  const getTagColor = (role) => {
    const roleLower = role?.toLowerCase();
    const roleColors = {
      "first party": "blue",
      "second party/successful resolution applicant (sra)": "purple",
      "escrow bank": "green",
      "spv (special purpose vehicle)": "orange",
      "company/corporate debtor": "red",
    };

    return roleColors[roleLower] || "default";
  };

  // Extract parties from document content when it updates
  useEffect(() => {
    const extractParties = async () => {
      setIsLoadingParties(true);
      try {
        let parsedResult;

        if (USE_HARDCODED) {
          // Use hardcoded values for testing
          parsedResult = HARDCODED_PARTIES;
        } else {
          // Use API for production
          parsedResult = await analyzeDocumentClauses(documentContent);
        }

        const partiesArray = Array.isArray(parsedResult)
          ? parsedResult
          : Array.isArray(parsedResult.parties)
          ? parsedResult.parties
          : [];

        const validParties = partiesArray
          .filter((party) => party && party.name)
          .map((party) => ({
            name: party.name,
            role: party.role || "Unknown Role",
          }));

        setParties(validParties);
      } catch (error) {
        console.error("Error extracting parties:", error);
        setParties([]);
      } finally {
        setIsLoadingParties(false);
      }
    };

    if (documentContent) {
      extractParties();
    }
  }, [documentContent]);

  return {
    parties,
    setParties,
    isLoadingParties,
    setIsLoadingParties,
    selectedParty,
    setSelectedParty,
    getTagColor,
  };
};
