import { useState } from "react";

export const useParties = () => {
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
