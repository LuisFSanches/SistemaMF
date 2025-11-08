# SistemaMF Frontend - AI Agent Instructions

## Project Overview
This is a **React + TypeScript** order management system for a flower shop/gift business. It handles online orders, in-store orders, client management, inventory, and payment tracking with real-time order notifications.

## Architecture & Key Patterns

### Core Technologies
- **React 18** with TypeScript (bootstrapped with Create React App)
- **styled-components** for all styling (no CSS/SCSS files)
- **react-router-dom v6** for routing
- **react-hook-form** for ALL form management
- **Socket.IO** for real-time order notifications
- **Chart.js** for dashboard analytics
- **Axios** with custom API instance
- **moment** + **moment-timezone** for date handling

### Project Structure
```
src/
├── components/     # Reusable components (each with index.tsx + style.ts)
├── contexts/       # Global state (Auth, Orders, Clients, Products, Admins)
├── services/       # API calls (all use the shared api.ts instance)
├── views/          # Page-level components (routes defined in routes.tsx)
├── interfaces/     # TypeScript interfaces (use .tsx extension)
├── constants/      # Shared constants and mappings
├── utils/          # Helper functions (formatTitleCase, convertMoney, etc.)
└── styles/         # global.ts only (contains GlobalStyle + shared styled components)
```

### Critical Conventions

#### 1. Styling Pattern
- **Every component has a `style.ts` file** (not `styles.ts`)
- Import from `styled-components`, never plain CSS
- Shared styled components live in `src/styles/global.ts`:
  - `PageHeader`, `FormField`, `Label`, `Input`, `Select`, `PrimaryButton`, etc.
- Color variables defined in `:root` within `GlobalStyle` (e.g., `var(--primary-color)`)

#### 2. Form Management
- **Always use `react-hook-form`** - never uncontrolled inputs or manual state
- Pattern: `const { register, handleSubmit, formState: { errors }, reset } = useForm<IType>()`
- Use `InputMask` from `react-input-mask` for phone/date fields
- Error display: `{errors.fieldName && <ErrorMessage>{errors.fieldName.message}</ErrorMessage>}`

#### 3. Context Architecture
- **5 main contexts**: `AuthContext`, `OrdersContext`, `ClientsContext`, `ProductsContext`, `AdminsContext`
- Context hooks: `useOrders()`, `useClients()`, `useProducts()`, `useAdmins()` (custom hooks)
- All API calls go through context providers, not directly in components
- Token stored in localStorage, injected in `api.defaults.headers.common.authorization`

#### 4. API Service Layer
- **Base instance**: `src/services/api.ts` configures axios with:
  - `baseURL`: `process.env.REACT_APP_API_URL || "http://localhost:3334"`
  - Custom header: `'x-custom-secret': "only-mirai-users"`
- All service files (`orderService.ts`, `clientService.ts`, etc.) import this `api` instance
- Token retrieval: `localStorage.getItem("token")?.replace(/"/g, '')`

#### 5. Real-Time Order Notifications
- **Socket.IO** connection in `src/hooks/useOrderSocket.ts`
- Listens to `'onlineOrderReceived'` event
- Dispatches custom `'new-order'` event on `window` for notifications
- `OrderNotification` component in `SideBarLayout` displays toast-style alerts

#### 6. Order Flow & Status Management
- **Order types**: Online (`online_order: true`), On-Store, Service Orders
- **Status enum** (in `IStatus.tsx`): `OPENED`, `WAITING_FOR_CLIENT`, `IN_PROGRESS`, `IN_DELIVERY`, `DONE`
- Status labels mapped in `src/constants/index.tsx` → `STATUS_LABEL`
- Order cards show type badges (`.online`, `.on_store`, `.pdv` classes)

#### 7. Routing & Auth
- **PrivateRoute wrapper** checks `isAuthenticated` from `AuthContext`
- Routes wrapped in `SideBarLayout` for authenticated pages
- Login redirects to `/pedidoBalcao` on success, stores token + adminData in localStorage

### Key Files to Reference

- **API Configuration**: `src/services/api.ts`
- **Global Styles**: `src/styles/global.ts` (imports for shared styled components)
- **Constants**: `src/constants/index.tsx` (payment methods, status labels, states)
- **Main Routes**: `src/routes.tsx`
- **Utility Functions**: `src/utils/index.tsx` (rawTelephone, convertMoney, formatTitleCase)

### Development Workflow

#### Running the App
```bash
npm start          # Starts dev server on localhost:3000
npm run build      # Production build
npm test           # Jest tests
```

#### Common Tasks
1. **Adding a new page**: Create in `src/views/[PageName]/`, add route in `routes.tsx`, wrap in `<PrivateRoute>`
2. **Adding a modal**: Follow pattern of existing modals (e.g., `OrderDetailModal`), use `react-modal`
3. **New API endpoint**: Add to relevant service file, import `api` instance, handle token in headers
4. **Styling a component**: Create `style.ts`, import styled, export named styled components

### Important Notes
- **No inline styles** except for rare dynamic width adjustments
- **Interfaces use `.tsx` extension** (not `.ts`), even when not containing JSX
- **Date formatting**: Always use `moment` with `pt-br` locale (`moment.locale('pt-br')`)
- **Phone input**: Use `react-input-mask` with mask `(99) 99999-9999`
- **FontAwesome icons**: Imported from `@fortawesome/react-fontawesome` + icon packs
- **PDF generation**: Uses `pdf-lib` + `@pdf-lib/fontkit` for order/card printing

### Domain-Specific Logic
- **Orders can have card messages** (`has_card`, `card_message`, `card_from`, `card_to`)
- **Delivery types** defined in `TYPES_OF_DELIVERY` constant
- **Payment methods**: CASH, PIX, CARD (mapped in `PAYMENT_METHODS`)
- **Admin roles**: ADMIN vs SUPER_ADMIN (affects permissions)
- **Client lookup by phone number** is common pattern in order creation flows

### Anti-Patterns to Avoid
- ❌ Creating CSS/SCSS files (use styled-components only)
- ❌ Using `useState` for form fields (use react-hook-form)
- ❌ Direct localStorage/token manipulation outside AuthContext
- ❌ Importing from `src/styles/` for component-specific styles
- ❌ Creating service functions that don't use the shared `api` instance

### AI-Specific Enhancements
- **OpenAI integration**: `createOrderByAi` endpoint in `orderService.ts` for natural language order creation
- Uses `openai` package (v5.13.1) - check `OnlineOrder` view for implementation

---

When making changes, maintain consistency with these patterns. Check similar existing components before implementing new features.
