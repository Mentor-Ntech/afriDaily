# AfriDaily Frontend-Contract Integration Implementation Plan

**Date:** December 3, 2025  
**Status:** Ready for Implementation  
**Network:** Celo Sepolia Testnet (Chain ID: 11142220)

---

## 📋 Executive Summary

This document outlines the complete integration plan to connect the AfriDaily frontend with deployed smart contracts, removing all mock data and implementing full functionality.

### Current State
- ✅ Frontend UI/UX completed
- ✅ Smart contracts deployed to Celo Sepolia
- ✅ Wallet connection (RainbowKit/wagmi) configured
- ❌ No contract integration (all data is mocked)
- ❌ No real balance fetching
- ❌ No transaction execution
- ❌ No event listening

### Target State
- ✅ All mock data replaced with contract calls
- ✅ Real-time balance display
- ✅ Full CRUD operations for streams and circles
- ✅ Transaction execution with proper error handling
- ✅ Event-based updates
- ✅ Offline transaction queuing
- ✅ Complete error handling and user feedback

---

## 🎯 Contract Addresses (Celo Sepolia)

```typescript
export const CONTRACT_ADDRESSES = {
  STREAM_MANAGER: "0x2A1E6591867e030F91560aB4782738B590C0fe5C",
  CIRCLE_VAULT: "0x99F06936A62c3f96fe7cB697FF3c49F75ADa3761",
  LOAN_POOL: "0x7d6Dadd13bAe7f361D442BFb42F966127019054a",
  CREDIT_PROFILE: "0x8eF59e8Bff9ae9ca27eb7C031CfBE915C5d335Dc",
  TREASURY: "0x897588900F28bC93bAb039D64B33A70bf49F6BaB",
}
```

### Stablecoin Addresses (Celo Sepolia)
```typescript
export const STABLECOIN_ADDRESSES = {
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // Mainnet address - verify for Sepolia
  cNGN: "0xe8537aCeaF7F50a92B05Df2D42ba20E2C221812B", // Mainnet address - verify for Sepolia
}
```

**⚠️ IMPORTANT:** Verify stablecoin addresses for Celo Sepolia testnet. These may differ from mainnet.

---

## 📦 Implementation Phases

### Phase 1: Foundation Setup (Priority: CRITICAL)
**Goal:** Create infrastructure for contract interactions

#### 1.1 Install Required Dependencies
- [ ] Install `@wagmi/core` if not already installed
- [ ] Install contract ABIs from `apps/contracts/artifacts`
- [ ] Create TypeScript types from contract ABIs

#### 1.2 Create Contract Configuration
**File:** `apps/web/lib/web3/contracts.ts`
- [ ] Define contract addresses
- [ ] Create contract instances using wagmi
- [ ] Export contract read/write hooks

#### 1.3 Create Contract Hooks
**Files:**
- `apps/web/hooks/use-stream-manager.ts`
- `apps/web/hooks/use-circle-vault.ts`
- `apps/web/hooks/use-loan-pool.ts`
- `apps/web/hooks/use-credit-profile.ts`
- `apps/web/hooks/use-stablecoin.ts`

#### 1.4 Create Utility Functions
**File:** `apps/web/lib/web3/utils.ts`
- [ ] Format BigNumber to readable strings
- [ ] Parse user input to BigNumber
- [ ] Calculate stream rates
- [ ] Handle transaction errors
- [ ] Gas estimation helpers

---

### Phase 2: Wallet & Balance Integration (Priority: CRITICAL)
**Goal:** Display real wallet balances and transaction history

#### 2.1 Wallet Balance Hook
**File:** `apps/web/hooks/use-wallet-balance.ts`
- [ ] Fetch cUSD balance
- [ ] Fetch cNGN balance
- [ ] Fetch CELO balance (for gas)
- [ ] Real-time updates on balance changes
- [ ] Loading and error states

#### 2.2 Update Wallet Page
**File:** `apps/web/app/wallet/page.tsx`
- [ ] Replace mock address with `useAccount().address`
- [ ] Replace mock balance with `useWalletBalance()`
- [ ] Fetch real transaction history from blockchain
- [ ] Display actual transaction hashes and statuses

#### 2.3 Transaction History Service
**File:** `apps/web/lib/web3/transaction-history.ts`
- [ ] Fetch transactions from Celo Explorer API
- [ ] Filter by user address
- [ ] Parse transaction data
- [ ] Cache transactions locally
- [ ] Handle pagination

#### 2.4 Update Dashboard
**File:** `apps/web/app/dashboard/page.tsx`
- [ ] Replace mock balance with real balance
- [ ] Calculate total from actual balances
- [ ] Remove mock activity data

---

### Phase 3: Stream Manager Integration (Priority: HIGH)
**Goal:** Full CRUD operations for salary streams

#### 3.1 Stream Manager Hook
**File:** `apps/web/hooks/use-stream-manager.ts`
**Functions to implement:**
- [ ] `useStreams()` - Fetch all user streams
- [ ] `useStream(streamId)` - Fetch single stream details
- [ ] `createStream()` - Create new stream
- [ ] `depositToStream()` - Add funds to stream
- [ ] `withdrawFromStream()` - Withdraw from stream
- [ ] `pauseStream()` - Pause a stream
- [ ] `resumeStream()` - Resume a stream
- [ ] `cancelStream()` - Cancel a stream
- [ ] `getAvailableBalance()` - Get withdrawable amount

#### 3.2 Update Streams Page
**File:** `apps/web/app/streams/page.tsx`
- [ ] Replace `mockStreams` with `useStreams()`
- [ ] Calculate stats from real data
- [ ] Handle loading states
- [ ] Handle empty states
- [ ] Real-time updates on stream changes

#### 3.3 Update Stream Details Page
**File:** `apps/web/app/streams/[id]/page.tsx`
- [ ] Fetch stream data using `useStream(id)`
- [ ] Display real balance and rate
- [ ] Calculate next payout time
- [ ] Implement withdraw functionality
- [ ] Show transaction history for stream

#### 3.4 Update Create Stream Page
**File:** `apps/web/app/streams/create/page.tsx`
- [ ] Connect form to `createStream()` function
- [ ] Calculate required deposit
- [ ] Handle token approval
- [ ] Show transaction status
- [ ] Redirect on success
- [ ] Error handling

#### 3.5 Update Withdraw Stream Page
**File:** `apps/web/app/streams/[id]/withdraw/page.tsx`
- [ ] Fetch available balance
- [ ] Connect to `withdrawFromStream()`
- [ ] Handle max withdrawal
- [ ] Show transaction progress
- [ ] Success/error feedback

#### 3.6 Update Stream Card Component
**File:** `apps/web/components/features/stream-card.tsx`
- [ ] Use real stream data
- [ ] Calculate available balance
- [ ] Show real status
- [ ] Handle actions (pause/resume)

---

### Phase 4: Circle Vault Integration (Priority: HIGH)
**Goal:** Full CRUD operations for savings circles

#### 4.1 Circle Vault Hook
**File:** `apps/web/hooks/use-circle-vault.ts`
**Functions to implement:**
- [ ] `useCircles()` - Fetch all user circles
- [ ] `useCircle(circleId)` - Fetch single circle details
- [ ] `useCircleMembers(circleId)` - Fetch circle members
- [ ] `createCircle()` - Create new circle
- [ ] `joinCircle()` - Join existing circle
- [ ] `contribute()` - Make contribution
- [ ] `distributeAjoPayout()` - Distribute Ajo payout
- [ ] `distributeEsusuPayout()` - Distribute Esusu payout

#### 4.2 Update Circles Page
**File:** `apps/web/app/circles/page.tsx`
- [ ] Replace `mockCircles` with `useCircles()`
- [ ] Calculate stats from real data
- [ ] Handle loading/empty states

#### 4.3 Update Circle Details Page
**File:** `apps/web/app/circles/[id]/page.tsx`
- [ ] Fetch circle data using `useCircle(id)`
- [ ] Fetch members using `useCircleMembers(id)`
- [ ] Display real progress and status
- [ ] Show member contribution status
- [ ] Implement contribute functionality
- [ ] Handle payout distribution

#### 4.4 Update Create Circle Page
**File:** `apps/web/app/circles/create/page.tsx`
- [ ] Connect form to `createCircle()` function
- [ ] Handle token selection
- [ ] Calculate contribution amounts
- [ ] Show transaction status
- [ ] Error handling

#### 4.5 Update Contribute Page
**File:** `apps/web/app/circles/[id]/contribute/page.tsx`
- [ ] Fetch circle details
- [ ] Connect to `contribute()` function
- [ ] Handle token approval
- [ ] Show transaction progress
- [ ] Success/error feedback

#### 4.6 Update Circle Card Component
**File:** `apps/web/components/features/circle-card.tsx`
- [ ] Use real circle data
- [ ] Calculate progress percentage
- [ ] Show real member count
- [ ] Display contribution status

---

### Phase 5: Token Operations (Priority: HIGH)
**Goal:** Handle ERC20 token operations (approve, transfer, balance)

#### 5.1 Stablecoin Hook
**File:** `apps/web/hooks/use-stablecoin.ts`
**Functions to implement:**
- [ ] `useTokenBalance(token, address)` - Get token balance
- [ ] `approveToken()` - Approve token spending
- [ ] `transferToken()` - Transfer tokens
- [ ] `useTokenAllowance()` - Check allowance

#### 5.2 Update Send Page
**File:** `apps/web/app/wallet/send/page.tsx`
- [ ] Connect to `transferToken()`
- [ ] Validate recipient address
- [ ] Check balance before sending
- [ ] Handle token selection (cUSD/cNGN)
- [ ] Show transaction status
- [ ] Success/error feedback

#### 5.3 Update Receive Page
**File:** `apps/web/app/wallet/receive/page.tsx`
- [ ] Display actual wallet address
- [ ] Generate QR code for address
- [ ] Support multiple tokens

#### 5.4 Update Add Funds Page
**File:** `apps/web/app/wallet/add-funds/page.tsx`
- [ ] Integrate with on-ramp providers (future)
- [ ] Show current balance
- [ ] Display supported tokens

---

### Phase 6: Transaction Management (Priority: MEDIUM)
**Goal:** Proper transaction handling, status tracking, and error management

#### 6.1 Transaction Hook
**File:** `apps/web/hooks/use-transaction.ts`
- [ ] Track transaction status
- [ ] Poll for confirmation
- [ ] Handle transaction errors
- [ ] Show transaction receipts
- [ ] Queue offline transactions

#### 6.2 Update Transaction Components
**Files:**
- `apps/web/components/features/transaction-history.tsx`
- `apps/web/components/features/recent-activity-list.tsx`
- `apps/web/components/features/transaction-details-dialog.tsx`
- [ ] Fetch real transactions
- [ ] Parse transaction data
- [ ] Show real status
- [ ] Link to block explorer

#### 6.3 Error Handling Service
**File:** `apps/web/lib/web3/errors.ts`
- [ ] Parse contract errors
- [ ] User-friendly error messages
- [ ] Error logging
- [ ] Retry logic

---

### Phase 7: Event Listening (Priority: MEDIUM)
**Goal:** Real-time updates via contract events

#### 7.1 Event Hooks
**Files:**
- `apps/web/hooks/use-stream-events.ts`
- `apps/web/hooks/use-circle-events.ts`
- [ ] Listen to StreamCreated events
- [ ] Listen to StreamWithdrawn events
- [ ] Listen to CircleCreated events
- [ ] Listen to ContributionMade events
- [ ] Update UI on event emission

#### 7.2 Real-time Updates
- [ ] Refresh data on new events
- [ ] Show notifications for events
- [ ] Update balances automatically

---

### Phase 8: Loan Pool Integration (Priority: LOW - Future)
**Goal:** Micro-loan functionality (can be implemented later)

#### 8.1 Loan Pool Hook
**File:** `apps/web/hooks/use-loan-pool.ts`
- [ ] Fetch available loans
- [ ] Create loan request
- [ ] Fund loan
- [ ] Repay loan
- [ ] Check credit score

---

### Phase 9: Testing & Validation (Priority: CRITICAL)
**Goal:** Ensure all functionality works correctly

#### 9.1 Integration Testing Checklist
- [ ] Wallet connection works
- [ ] Balance display is accurate
- [ ] Stream creation works
- [ ] Stream withdrawal works
- [ ] Circle creation works
- [ ] Circle contribution works
- [ ] Token transfers work
- [ ] Transaction history displays correctly
- [ ] Error handling works
- [ ] Loading states display correctly
- [ ] Empty states display correctly

#### 9.2 Edge Cases
- [ ] Insufficient balance handling
- [ ] Network errors
- [ ] Transaction failures
- [ ] Invalid addresses
- [ ] Zero balance display
- [ ] Large number formatting

---

## 🔧 Technical Implementation Details

### Contract ABIs
ABIs are located in:
- `apps/contracts/artifacts/contracts/StreamManager.sol/StreamManager.json`
- `apps/contracts/artifacts/contracts/CircleVault.sol/CircleVault.json`
- `apps/contracts/artifacts/contracts/LoanPool.sol/LoanPool.json`
- `apps/contracts/artifacts/contracts/CreditProfile.sol/CreditProfile.json`

### TypeScript Types
Types are generated in:
- `apps/contracts/typechain-types/contracts/`

### Wagmi Configuration
Already configured in:
- `apps/web/lib/web3/config.ts`

### Environment Variables
Required in `apps/web/.env.local`:
```env
NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_STREAM_MANAGER_ADDRESS=0x2A1E6591867e030F91560aB4782738B590C0fe5C
NEXT_PUBLIC_CIRCLE_VAULT_ADDRESS=0x99F06936A62c3f96fe7cB697FF3c49F75ADa3761
NEXT_PUBLIC_LOAN_POOL_ADDRESS=0x7d6Dadd13bAe7f361D442BFb42F966127019054a
NEXT_PUBLIC_CREDIT_PROFILE_ADDRESS=0x8eF59e8Bff9ae9ca27eb7C031CfBE915C5d335Dc
NEXT_PUBLIC_CUSD_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_CNGN_ADDRESS=0xe8537aCeaF7F50a92B05Df2D42ba20E2C221812B
```

---

## 📝 Implementation Order

1. **Phase 1** - Foundation Setup (Day 1)
2. **Phase 2** - Wallet & Balance Integration (Day 1-2)
3. **Phase 3** - Stream Manager Integration (Day 2-3)
4. **Phase 4** - Circle Vault Integration (Day 3-4)
5. **Phase 5** - Token Operations (Day 4-5)
6. **Phase 6** - Transaction Management (Day 5)
7. **Phase 7** - Event Listening (Day 6)
8. **Phase 9** - Testing & Validation (Day 6-7)

---

## ✅ Success Criteria

- [ ] Zero mock data in production code
- [ ] All contract functions accessible from UI
- [ ] Real-time balance updates
- [ ] Transaction status tracking
- [ ] Proper error handling
- [ ] Loading states for all async operations
- [ ] Empty states for no data
- [ ] Mobile-responsive design maintained
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance optimized

---

## 🚨 Critical Notes

1. **Token Approvals:** Always check and request token approval before contract interactions
2. **Gas Estimation:** Always estimate gas before transactions
3. **Error Handling:** Parse contract errors and show user-friendly messages
4. **Loading States:** Show loading indicators for all async operations
5. **Transaction Confirmation:** Wait for transaction confirmation before updating UI
6. **BigNumber Handling:** Always use proper BigNumber formatting for display
7. **Network Verification:** Ensure user is on correct network (Celo Sepolia)
8. **Address Validation:** Validate all addresses before use

---

## 📚 Resources

- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [RainbowKit Documentation](https://rainbowkit.com)
- [Celo Documentation](https://docs.celo.org)
- Contract ABIs: `apps/contracts/artifacts/`
- Contract Types: `apps/contracts/typechain-types/`

---

**Next Step:** Begin Phase 1 implementation

