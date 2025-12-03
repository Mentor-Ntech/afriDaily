# AfriDaily v0.app Generation Prompt

## PROJECT CONTEXT
Build a complete mobile-first Progressive Web Application (PWA) for AfriDaily, a crypto-first financial platform built for African markets (Nigeria and Kenya initially). The app enables stablecoin-based daily finance management on the Celo blockchain using Mento stablecoins (cNGN, cUSD). Target users are crypto earners, freelancers, remote contractors, and Web3 contributors who need salary streaming, automated savings, peer savings circles (ajo/esusu), and micro-loans.

## DESIGN SYSTEM REQUIREMENTS

### Color Palette (Strict Adherence Required)
- **Brand Primary**: `#0B5FFF` (Blue) - Primary actions, CTAs, active states, links
- **Accent**: `#FFB703` (Orange/Yellow) - Highlights, rewards, gamification elements, notifications
- **Success**: `#16A34A` (Green) - Success states, confirmations, positive balances, completed transactions
- **Danger**: `#EF4444` (Red) - Errors, warnings, negative balances, failed transactions, delete actions
- **Neutral Grays**: Use semantic grays for backgrounds, borders, text (ensure WCAG AA contrast ratios)
- **Background**: Light mode default with dark mode support (respect system preferences)

### Typography Scale (Mobile-First, Low-Literacy Optimized)
- **H1**: 28px, line-height 1.4, font-weight 700 - Page titles, hero headings
- **H2**: 24px, line-height 1.4, font-weight 600 - Section headers, card titles
- **Body**: 16px, line-height 1.5, font-weight 400 - Primary content, descriptions
- **Small**: 14px, line-height 1.4, font-weight 400 - Secondary text, captions, labels
- **Font Family**: System font stack optimized for readability (San Francisco, Segoe UI, Roboto, sans-serif)
- **Text must be highly legible at small sizes** - critical for low-literacy contexts

### Spacing System (8px Base Unit)
- **sm**: 8px - Tight spacing, icon padding, small gaps
- **md**: 16px - Standard spacing, component padding, form fields
- **lg**: 24px - Section spacing, card padding, large gaps
- **xl**: 32px - Page margins, major section breaks
- **2xl**: 48px - Hero sections, major page sections

### Motion & Transitions
- **Base Duration**: 200ms for all transitions
- **Easing**: `ease-in-out` for standard transitions, `ease-out` for entrances, `ease-in` for exits
- **Respect Reduced Motion**: Use `prefers-reduced-motion` media query, disable animations when user prefers reduced motion
- **Micro-interactions**: Subtle hover states, button press feedback, loading states

### Accessibility Requirements (WCAG AA Baseline)
- **Keyboard Navigation**: All interactive elements must be keyboard accessible (Tab, Enter, Esc)
- **Focus Indicators**: Visible, high-contrast focus rings on all focusable elements (use brand color with sufficient contrast)
- **Touch Targets**: Minimum 44x44px for all interactive elements (mobile-first)
- **ARIA Labels**: Proper semantic HTML, ARIA labels for icons, form fields, and complex components
- **Color Contrast**: All text must meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **Screen Reader Support**: Descriptive labels, live regions for dynamic content, proper heading hierarchy

## COMPONENT LIBRARY SPECIFICATIONS

### Button Component (4 Variants)
1. **Primary Button**: 
   - Background: Brand color `#0B5FFF`
   - Text: White
   - Hover: Slightly darker blue
   - Active: Pressed state with visual feedback
   - Disabled: 40% opacity, no interaction
   - Padding: 12px 24px (md spacing)
   - Border radius: 8px
   - Font: Body (16px), font-weight 600

2. **Secondary Button**:
   - Background: Transparent
   - Border: 2px solid brand color `#0B5FFF`
   - Text: Brand color `#0B5FFF`
   - Hover: Light blue background tint
   - Same padding and sizing as primary

3. **Ghost Button**:
   - Background: Transparent
   - Border: None
   - Text: Brand color or neutral gray
   - Hover: Subtle background tint
   - Used for tertiary actions

4. **Disabled State**:
   - All variants: 40% opacity
   - Cursor: not-allowed
   - No hover/active states

### Modal Component
- **Backdrop**: Semi-transparent dark overlay (rgba(0,0,0,0.5))
- **Container**: White background, rounded corners (16px), max-width 90vw on mobile, centered
- **Header**: H2 typography, close button (X icon) in top-right
- **Body**: Scrollable content area with md padding
- **Footer**: Action buttons (Primary/Secondary) aligned right, md spacing between
- **Animation**: Fade in + slide up (200ms), respect reduced motion
- **Keyboard**: Esc to close, Tab trap focus within modal

### Form Components
- **Input Fields**:
  - Border: 1px solid neutral gray, 2px brand color on focus
  - Border radius: 8px
  - Padding: 12px 16px (md spacing)
  - Font: Body (16px)
  - Label: Above input, Small typography (14px), font-weight 500
  - Error state: Red border (`#EF4444`), error message below in Small red text
  - Success state: Green border (`#16A34A`)
  - Placeholder: Lighter gray, italic

- **Amount Input** (for cUSD/cNGN):
  - Large, prominent display
  - Currency symbol prefix (₵ for cUSD, ₦ for cNGN)
  - Numeric keyboard on mobile
  - Format numbers with thousand separators
  - Example display: "₵25.00"

- **Select/Dropdown**:
  - Same styling as input fields
  - Custom dropdown arrow
  - Keyboard navigable options

### StreamCard Component
- **Container**: White card with subtle shadow, rounded corners (12px), md padding
- **Header Section**:
  - Title: "Salary Stream — [Employer Name]" (H2 typography, 24px)
  - Subtitle: "Rate: ₵0.45 / hr" (Small typography, neutral gray)
- **Balance Section**:
  - Label: "Available" (Small, neutral gray)
  - Amount: Large, prominent (28px H1 typography, brand color)
  - Currency: "cUSD 12.34" format
- **Metadata**:
  - "Next payout • Sep 30" (Small typography, neutral gray)
- **Actions**:
  - Two buttons: "Details" (Ghost) and "Withdraw" (Primary)
  - Horizontal layout, right-aligned
- **Hover State**: Subtle elevation increase, smooth transition

### WalletConnectButton Component
- **State 1 - Not Connected**:
  - Primary button style
  - Text: "Connect Wallet"
  - Icon: Wallet icon (left side)
  - Triggers wallet connection flow

- **State 2 - Connected**:
  - Secondary or Ghost button style
  - Display: Truncated address (e.g., "0x1234...5678")
  - Icon: Checkmark or wallet icon
  - Dropdown menu on click: "Disconnect", "View on Explorer", "Copy Address"

## PAGE STRUCTURE & ROUTES

### 1. Home Page (`/` or `/home`)
**Layout**:
- **Header**: App logo/name "AfriDaily", wallet connect button (top-right), navigation menu icon
- **Hero Section**:
  - Welcome message: "Manage your crypto earnings with ease"
  - Total balance card: Large display of combined cUSD/cNGN balance
  - Quick actions: "Create Stream", "Join Circle", "Add Funds" (3-column grid on mobile)
- **Active Streams Section**:
  - Section header: "Active Salary Streams" (H2)
  - Grid/list of StreamCard components (2 per row on mobile, scrollable)
  - Empty state: "No active streams. Create your first stream to get started." with CTA button
- **Savings Circles Section**:
  - Section header: "My Savings Circles" (H2)
  - Cards showing circle name, total saved, next contribution date, members count
  - Empty state with "Create Circle" CTA
- **Recent Activity**:
  - Transaction list: Date, type, amount, status (success/danger colors)
  - Collapsible section
- **Bottom Navigation**: Home (active), Wallet, Streams, Circles icons

**Design Notes**:
- Mobile-first: Single column layout, touch-friendly spacing
- Offline indicator: Show "Offline Mode" badge when disconnected
- Loading states: Skeleton screens for async data

### 2. Wallet Page (`/wallet`)
**Layout**:
- **Header**: "My Wallet" (H1), back button
- **Balance Overview Card**:
  - Total balance: Large H1 display (28px)
  - Breakdown: cUSD and cNGN amounts in smaller text
  - Currency toggle: Switch between cUSD/cNGN display
- **Quick Actions**:
  - "Send" button (Primary)
  - "Receive" button (Secondary)
  - "Add Funds" button (Ghost)
  - Horizontal layout, equal width
- **Address Section**:
  - "Wallet Address" label
  - Address display: Monospace font, copy button
  - QR code: Tappable to show full QR code modal
- **Transaction History**:
  - Filter tabs: "All", "Sent", "Received", "Streams", "Circles"
  - List of transactions:
    - Date/time (Small typography)
    - Transaction type icon
    - Amount (positive: success color, negative: danger color)
    - Status badge (Success/Danger/Pending)
    - Tap to expand details
  - Infinite scroll or pagination
- **Security Section**:
  - "Backup Wallet" button (Secondary)
  - "Export Private Key" button (Ghost, with warning)
  - Both open modals with confirmation steps

**Design Notes**:
- Prominent balance display for trust and clarity
- Transaction list optimized for scanning
- Security actions clearly separated with visual hierarchy

### 3. Streams Page (`/streams`)
**Layout**:
- **Header**: "Salary Streams" (H1), "Create Stream" button (Primary, top-right)
- **Active Streams Section**:
  - List/grid of StreamCard components
  - Each card shows: Employer name, rate, available balance, next payout, actions
  - Empty state: Large illustration, "No active streams", "Create your first stream" CTA
- **Create Stream Flow** (Modal or separate page):
  - Step 1: Basic Info
    - Form fields: Stream name, Employer/Client name
    - Hourly rate input (Amount input with cUSD/cNGN)
    - Frequency selector: "Hourly", "Daily", "Weekly", "Monthly"
  - Step 2: Configuration
    - Start date picker
    - Auto-withdraw toggle (switch component)
    - Withdrawal threshold (optional amount input)
  - Step 3: Review & Confirm
    - Summary of all settings
    - Estimated earnings display
    - "Create Stream" button (Primary)
    - Gas fee estimate shown (Small text, neutral gray)
- **Stream Details Page** (on card tap):
  - Full stream information
  - Earnings chart/graph (simple line or bar chart)
  - Transaction history for this stream
  - "Withdraw" button (Primary)
  - "Edit Stream" button (Secondary)
  - "Pause Stream" button (Ghost)
  - "Delete Stream" button (Ghost, danger color)

**Design Notes**:
- Stream cards are the primary visual element - make them prominent and scannable
- Create flow should be simple, maximum 3 steps
- Show real-time or near-real-time balance updates

### 4. Circles Page (`/circles`)
**Layout**:
- **Header**: "Savings Circles" (H1), "Create Circle" button (Primary, top-right)
- **My Circles Section**:
  - Cards for each circle user is part of:
    - Circle name (e.g., "Family Ajo Circle")
    - Type badge: "Ajo" or "Esusu" (cultural context)
    - Total saved: Large amount display
    - Members: "5 members" (Small text)
    - Next contribution: Date and amount
    - Progress indicator: Visual progress bar
    - Status: "Active", "Pending", "Completed"
    - Actions: "Contribute", "View Details"
  - Empty state: "Join or create a savings circle to start saving together"
- **Create Circle Flow** (Modal or separate page):
  - Step 1: Circle Type
    - Radio buttons: "Ajo" (rotating savings), "Esusu" (fixed order)
    - Description of each type (cultural context)
  - Step 2: Circle Details
    - Circle name input
    - Contribution amount (Amount input)
    - Frequency: "Daily", "Weekly", "Bi-weekly", "Monthly"
    - Total duration or number of cycles
    - Member limit (number input)
  - Step 3: Invite Members
    - Add member by wallet address or username
    - Member list with remove option
    - Minimum members requirement shown
  - Step 4: Review & Deploy
    - Summary of circle configuration
    - Smart contract deployment notice
    - Gas fee estimate
    - "Create Circle" button (Primary)
- **Circle Details Page** (on card tap):
  - Circle overview: Name, type, total goal, current balance
  - Members list: Avatar/initials, wallet address (truncated), contribution status
  - Contribution schedule: Calendar or list view
  - Transaction history: All contributions and payouts
  - Actions: "Make Contribution" (Primary), "Invite Member" (Secondary)
  - Admin actions (if creator): "Edit Circle", "Remove Member", "Close Circle"

**Design Notes**:
- Emphasize cultural context (Ajo/Esusu) - these are familiar savings methods in Nigeria/Kenya
- Show trust indicators: Member verification, on-chain transparency
- Progress visualization is critical for engagement

## FEATURE COMPONENTS

### Wallet Creation Flow (`/wallet/create`)
- **Step 1: Welcome**
  - Illustration or icon
  - "Create Your Wallet" heading
  - Brief explanation: "Your wallet stores your stablecoins securely"
  - "Get Started" button
- **Step 2: Security Warning**
  - Important: "Save your recovery phrase. You'll need it to restore your wallet."
  - Checkbox: "I understand I'm responsible for keeping my recovery phrase safe"
  - "Continue" button (disabled until checked)
- **Step 3: Recovery Phrase Display**
  - 12 or 24 word grid (read-only, masked initially)
  - "Reveal Phrase" button (Secondary)
  - "Copy Phrase" button (Ghost)
  - Warning: "Never share your recovery phrase with anyone"
  - "I've Saved My Phrase" checkbox
  - "Continue" button (disabled until checked)
- **Step 4: Verification**
  - Random word selection: "Enter word #3, #7, #12" etc.
  - Input fields for selected words
  - "Verify" button (Primary)
- **Step 5: Set Password/PIN**
  - Password input (with strength indicator)
  - Confirm password
  - Optional: 6-digit PIN for quick access
- **Step 6: Success**
  - Success icon (green checkmark)
  - "Wallet Created Successfully"
  - "Go to Wallet" button (Primary)

### Wallet Import Flow (`/wallet/import`)
- **Step 1: Choose Method**
  - Options: "Recovery Phrase", "Private Key", "Keystore File"
- **Step 2: Enter Credentials**
  - Based on method: Textarea for phrase, input for key, file upload for keystore
  - Validation feedback
- **Step 3: Set Password/PIN** (if new device)
- **Step 4: Success & Redirect**

### Create Stream Flow (`/streams/create`)
- Multi-step form as described in Streams Page section
- Use Modal component for overlay or full-page flow
- Progress indicator: "Step 1 of 3"
- Back button on each step
- Form validation with clear error messages
- Success state: "Stream created! You'll start earning in [timeframe]"

### Withdraw from Stream (`/streams/[id]/withdraw`)
- **Modal or Page**:
  - Current available balance (large display)
  - Amount input (with max button)
  - Recipient address input (or "My Wallet" quick select)
  - Network fee estimate (Small text)
  - "Withdraw" button (Primary)
  - Confirmation step: Review details, "Confirm Withdrawal" button
  - Success: Transaction hash, "View on Explorer" link

### Create Circle Flow (`/circles/create`)
- Multi-step form as described in Circles Page section
- Cultural context explanations for Ajo vs Esusu
- Member invitation interface with address validation
- Smart contract deployment indicator (loading state)
- Success: Circle address, "Share with Members" option

### Contribute to Circle (`/circles/[id]/contribute`)
- **Modal or Page**:
  - Circle name and current status
  - Contribution amount (pre-filled, editable)
  - Due date display
  - "Make Contribution" button (Primary)
  - Confirmation: Review, "Confirm Contribution" button
  - Success: Transaction confirmation

## UI PATTERNS & INTERACTIONS

### Navigation
- **Bottom Navigation Bar** (Mobile):
  - Icons: Home, Wallet, Streams, Circles
  - Active state: Brand color, inactive: Neutral gray
  - Labels below icons (Small typography)
  - Fixed at bottom, safe area padding for notched devices
- **Top Navigation** (Desktop/Tablet):
  - Horizontal menu bar
  - Logo on left, nav items center, wallet connect right
- **Breadcrumbs**: For nested pages (e.g., Streams > Create Stream)

### Loading States
- **Skeleton Screens**: For async data (balances, transaction lists)
  - Animated shimmer effect (respect reduced motion)
  - Match content layout
- **Spinner**: For button actions, centered for page loads
  - Brand color spinner
  - Size: 24px for buttons, 48px for page loads

### Empty States
- **Illustration or Icon**: Large, centered, neutral color
- **Heading**: H2 typography, descriptive
- **Description**: Body text, helpful guidance
- **CTA Button**: Primary button, clear action

### Error States
- **Inline Errors**: Red text below form fields (Small typography)
- **Error Messages**: Red alert box with icon, dismissible
- **Network Errors**: "Connection failed. Please check your internet." with retry button
- **Transaction Errors**: "Transaction failed. [Reason]." with "Try Again" button

### Success States
- **Toast Notifications**: Green background, checkmark icon, auto-dismiss after 3s
- **Success Pages**: Large checkmark icon, confirmation message, next action button

### Offline Support
- **Offline Badge**: Top of screen, accent color background, "Offline Mode" text
- **Queued Transactions**: Show pending queue, "Sync when online" message
- **Cached Data**: Show last known balance with "Last updated [time]" note

## RESPONSIVE DESIGN

### Breakpoints
- **Mobile**: 320px - 767px (Primary focus)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile-First Approach
- Single column layouts
- Full-width cards and components
- Touch-optimized spacing (minimum 44px touch targets)
- Bottom navigation for primary actions
- Swipe gestures where appropriate (transaction list swipe actions)

### Tablet Adaptations
- 2-column grids where appropriate
- Side navigation option
- Larger touch targets maintained

### Desktop Adaptations
- Multi-column layouts
- Hover states enabled
- Keyboard shortcuts
- Larger max-width containers (1200px)

## CULTURAL & LOCALIZATION CONSIDERATIONS

### Language Support
- Primary: English
- Prepare for: Swahili, Hausa, Yoruba, Igbo (structure for i18n)
- Text should be concise, clear, avoid jargon
- Use familiar financial terms where possible

### Cultural Context
- **Ajo/Esusu Savings Circles**: These are traditional rotating savings methods in Nigeria/Kenya
  - Explain clearly but use familiar terminology
  - Show trust and transparency (on-chain verification)
- **Currency Display**: 
  - cNGN (Nigerian Naira stablecoin): Use ₦ symbol
  - cUSD (US Dollar stablecoin): Use ₵ or $ symbol
  - Show both currencies prominently where relevant

### Financial Literacy
- **Simple Language**: Avoid complex DeFi terminology
- **Visual Aids**: Icons, illustrations, progress bars
- **Tooltips**: Helpful explanations on hover/tap for technical terms
- **Onboarding**: Educational tooltips for first-time users

## WEB3 INTEGRATION POINTS

### Wallet Connection
- Support: MetaMask, WalletConnect, Celo native wallets
- Connection flow: Modal with wallet options
- Network switching: Prompt to switch to Celo network if on wrong network
- Connection persistence: Remember connected wallet

### Transaction Handling
- **Gas Estimation**: Show estimated gas fees before transactions
- **Transaction Status**: 
  - Pending: Loading spinner, "Transaction pending..."
  - Success: Green checkmark, transaction hash link
  - Failed: Red X, error message, retry option
- **Transaction History**: Link to Celo Explorer for all transactions
- **Smart Contract Interactions**: Clear indication when interacting with contracts (StreamManager, CircleVault, LoanPool)

### Balance Display
- Real-time or near-real-time updates
- Show both cUSD and cNGN balances
- Conversion rates (if applicable)
- Loading states while fetching

## PERFORMANCE & OPTIMIZATION

### PWA Requirements
- Service worker for offline support
- App manifest for installability
- Caching strategy for static assets
- Offline transaction queue

### Image Optimization
- Use SVGs for icons (scalable, small file size)
- Optimize illustrations (WebP format, lazy loading)
- Placeholder images for async content

### Code Splitting
- Route-based code splitting
- Lazy load heavy components (charts, modals)
- Optimize bundle size for mobile networks

### Low-Bandwidth Optimization
- Minimal initial load
- Progressive enhancement
- Skeleton screens instead of spinners where possible
- Compress API responses
- Cache aggressively

## ACCESSIBILITY IMPLEMENTATION

### Semantic HTML
- Use proper heading hierarchy (h1, h2, h3)
- Semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<form>`
- Proper form labels and field associations

### ARIA Attributes
- `aria-label` for icon-only buttons
- `aria-describedby` for form field help text
- `aria-live` regions for dynamic content updates
- `aria-expanded` for collapsible sections
- `role` attributes where semantic HTML isn't sufficient

### Keyboard Navigation
- Tab order: Logical flow through page
- Enter/Space: Activate buttons and links
- Esc: Close modals, cancel actions
- Arrow keys: Navigate lists, dropdowns
- Focus management: Return focus after modal close

### Screen Reader Support
- Descriptive alt text for images
- Hidden labels for decorative elements
- Announce dynamic content changes
- Proper form error announcements

## IMPLEMENTATION NOTES

### Technology Stack Hints
- React with TypeScript
- Tailwind CSS or CSS Modules (use design tokens)
- React Router for navigation
- State management: Context API or Zustand
- Web3: Viem or ethers.js, Wagmi for React hooks
- Form handling: React Hook Form with validation
- Animation: Framer Motion (with reduced motion support)

### Code Quality
- TypeScript strict mode
- Component composition over inheritance
- Reusable hooks for common logic
- Error boundaries for graceful error handling
- Consistent naming conventions

### Testing Considerations
- Components should be testable
- Accessible by default (test with keyboard, screen reader)
- Responsive across breakpoints
- Handle loading, error, empty states

## FINAL REQUIREMENTS

1. **All components must strictly follow the design system** (colors, spacing, typography, motion)
2. **Mobile-first approach** - optimize for 320px-767px screens primarily
3. **Accessibility is non-negotiable** - WCAG AA compliance, keyboard navigation, screen reader support
4. **Cultural sensitivity** - Use familiar terms (Ajo/Esusu), clear language, visual aids
5. **Offline-first mindset** - Show offline states, queue transactions, cache data
6. **Web3 integration ready** - Wallet connection, transaction handling, balance display
7. **Performance optimized** - Fast load times, efficient rendering, low bandwidth usage
8. **Error handling** - Graceful error states, clear messaging, recovery options
9. **Loading states** - Skeleton screens, spinners, progressive loading
10. **Consistent patterns** - Reusable components, consistent spacing, unified interactions

Generate all interfaces, components, and pages following these specifications. Each component should be production-ready, accessible, and aligned with the AfriDaily design system and project requirements.