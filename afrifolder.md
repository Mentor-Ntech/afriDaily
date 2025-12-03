folder structure — AfriDaily PWA + Hardhat (complete scaffold)

afridaily/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── release.yml
│   │   └── slither.yml
│   └── ISSUE_TEMPLATE.md
├── .vscode/
│   └── settings.json
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml        # or yarn workspace configuration
├── README.md
├── LICENSE
├── docs/
│   ├── architecture.md
│   ├── api_spec.md
│   ├── runbooks/
│   │   ├── incident_response.md
│   │   └── deploy_rollback.md
│   ├── security/
│   │   ├── security_policy.md
│   │   └── ota_release_checklist.md
│   └── legal/
│       └── privacy_policy.md
├── packages/
│   ├── web/                   # PWA (Vite + React + TypeScript)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   ├── icons/
│   │   │   └── manifest.webmanifest
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   ├── routes/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Wallet.tsx
│   │   │   │   ├── Streams.tsx
│   │   │   │   └── Circles.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   └── Modal.tsx
│   │   │   │   ├── WalletConnectButton.tsx
│   │   │   │   └── StreamCard.tsx
│   │   │   ├── features/
│   │   │   │   ├── wallet/
│   │   │   │   │   ├── create.tsx
│   │   │   │   │   ├── import.tsx
│   │   │   │   │   └── seed-utils.ts
│   │   │   │   ├── streams/
│   │   │   │   │   ├── createStream.tsx
│   │   │   │   │   └── withdraw.tsx
│   │   │   │   └── circles/
│   │   │   │       ├── createCircle.tsx
│   │   │   │       └── contribute.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useOfflineQueue.ts
│   │   │   ├── lib/
│   │   │   │   ├── web3/
│   │   │   │   │   ├── viemClient.ts
│   │   │   │   │   └── wagmiAdapter.ts
│   │   │   │   └── storage/
│   │   │   │       └── idb.ts
│   │   │   └── i18n/
│   │   │       └── en.json
│   │   ├── sw/
│   │   │   ├── service-worker.ts
│   │   │   └── workbox-config.js
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── e2e/
│   │   └── README.md
│   │
│   ├── backend/                 # Node/TS API, indexer & adapters
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── app.ts
│   │   │   ├── routes/
│   │   │   │   └── api/
│   │   │   │       ├── auth.ts
│   │   │   │       ├── wallets.ts
│   │   │   │       └── streams.ts
│   │   │   ├── services/
│   │   │   │   ├── indexer/
│   │   │   │   │   ├── indexer.ts
│   │   │   │   │   └── processors/
│   │   │   │   ├── onofframps/
│   │   │   │   │   ├── adapter.interface.ts
│   │   │   │   │   └── partnerA.adapter.ts
│   │   │   │   ├── kyc/
│   │   │   │   └── scoring/
│   │   │   ├── jobs/
│   │   │   │   └── flush-tx-queue.job.ts
│   │   │   ├── lib/
│   │   │   │   ├── db.ts
│   │   │   │   ├── logger.ts
│   │   │   │   └── web3-provider.ts
│   │   │   └── admin/
│   │   │       └── console.tsx
│   │   ├── tests/
│   │   └── README.md
│   │
│   ├── contracts/               # Hardhat project (Solidity + TS tests)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── hardhat.config.ts
│   │   ├── scripts/
│   │   │   └── deploy.ts
│   │   ├── contracts/
│   │   │   ├── StreamManager.sol
│   │   │   ├── CircleVault.sol
│   │   │   └── LoanPool.sol
│   │   ├── test/
│   │   │   ├── stream.test.ts
│   │   │   └── circle.test.ts
│   │   ├── tools/
│   │   │   ├── slither.yml
│   │   │   └── mythx.config.json
│   │   └── README.md
│   │
│   ├── libs/                    # shared TypeScript libs / SDK / types
│   │   ├── package.json
│   │   └── src/
│   │       ├── types.ts
│   │       └── sdk/
│   │           └── afridaily-sdk.ts
│   │
│   └── infra/                   # infra-as-code (terraform, k8s, helm)
│       ├── terraform/
│       │   ├── modules/
│       │   ├── main.tf
│       │   └── outputs.tf
│       └── k8s/
│           ├── deployments/
│           │   ├── web-deployment.yaml
│           │   └── backend-deployment.yaml
│           ├── services/
│           └── helm/
│
├── docker-compose.yml
├── docker/
│   ├── web.Dockerfile
│   └── backend.Dockerfile
│
├── scripts/
│   ├── dev-setup.sh
│   ├── start-local-celo.sh
│   ├── deploy-contracts.sh
│   └── migrate-db.sh
|
└── tools/                       # repo-level utilities & templates
    ├── templates/
    │   ├── github-actions/
    │   └── slack-alerts/
    └── security/
        └── immunefi_template.md



