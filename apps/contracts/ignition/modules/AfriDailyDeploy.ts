// This module deploys all AfriDaily smart contracts
// Deployment order: CreditProfile -> LoanPool -> StreamManager, CircleVault, Treasury

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AfriDailyModule = buildModule("AfriDailyModule", (m) => {
  // Deploy CreditProfile first (standalone, no dependencies)
  const creditProfile = m.contract("CreditProfile", [], {
    id: "CreditProfile",
  });

  // Deploy LoanPool (depends on CreditProfile)
  const loanPool = m.contract("LoanPool", [creditProfile], {
    id: "LoanPool",
  });

  // Deploy StreamManager (standalone)
  const streamManager = m.contract("StreamManager", [], {
    id: "StreamManager",
  });

  // Deploy CircleVault (standalone)
  const circleVault = m.contract("CircleVault", [], {
    id: "CircleVault",
  });

  // Deploy Treasury (standalone)
  const treasury = m.contract("Treasury", [], {
    id: "Treasury",
  });

  return {
    creditProfile,
    loanPool,
    streamManager,
    circleVault,
    treasury,
  };
});

export default AfriDailyModule;

