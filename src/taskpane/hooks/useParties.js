import { useState, useEffect } from "react";
import { useDocument } from "./useDocument";
import { HARDCODED_PARTIES } from "../components/constants/analysisData";

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
        // Simulating `analyzeParties` logic
        const parsedResult = HARDCODED_PARTIES; // Replace with real parsing if needed

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
