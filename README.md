<<<<<<< HEAD
# Furniture E-Commerce Mobile Application

An elegant, production-grade mobile shopping application built on **React Native** and **Expo SDK 54**. The app delivers a high-performance shopping experience conforming to Figma design specifications. It features a fully responsive layout system, offline state persistence, date-grouped collections, dynamic image carousels, and real-time state tracking.

---

## 🚀 Key Features

### 1. Dynamic SectionList Date-Grouping
- Groups loaded products chronologically under distinct headers: `"Today"`, `"Yesterday"`, `"17 April"`, `"16 April"`, and `"15 April"`.
- Solves the React Native `SectionList` double-column limitation by grouping grid items in pairs of two (`[[p1, p2], [p3]]`) and rendering them inside a row wrapper, maintaining a clean 2-column visual grid.

### 2. Production-Grade API Pagination
- Queries the backend dynamically using `skip` and `limit` query parameters.
- Features a loading footer spinner with feedback text (`"Loading more items..."`) and an end-of-list indicator (`"No more data available"`).
- Guarded with scroll-locking mechanisms to prevent duplicate requests.

### 3. Product Image Paging Carousel
- Features a horizontal `ScrollView` with `pagingEnabled={true}` in the detail screen, allowing users to swipe through all available product images.
- Updates indicator dots dynamically using an `onScroll` event listener tracking offset calculations.

### 4. Dynamic Redux Profile Bindings
- Connects user name, email, favorites count, and orders count directly to persisted Redux state selectors.
- Features a checkout tracker that dynamically increments the user's order history count on the profile screen upon a successful checkout.

### 5. Custom Plus Icon Asset Integration
- Standardized all add-to-cart buttons and quantity increment triggers across the app to render the custom `add.png` image asset from the local `IMAGE_MAP`, using `tintColor` where necessary to support high-contrast dark/light styling.

### 6. Responsive Layout System
- Employs a custom percentage-based scaling utility (`wp` / `hp`) to scale texts, margins, paddings, and heights dynamically across phone and tablet screens of all form factors.

### 7. Real-Time Connection Toast
- Monitors internet status using NetInfo, showing a custom red `"Internet connection off"` bottom toast when offline.

---

## 🛠️ Technology Stack

- **Core**: React Native, TypeScript, Expo SDK 54
- **State Management**: Redux Toolkit, Redux Persist (with AsyncStorage for offline caching)
- **Networking**: Axios Client with custom request/response interceptors
- **Image Performance**: `expo-image` for high-performance caching support
- **Icons**: `@expo/vector-icons` (Ionicons)

---

## 📁 Folder Structure (`src/`)

```
src/
├── api/
│   ├── manager.ts         - Central Axios manager and interceptors
│   ├── endpoints.ts       - API endpoint paths constants
│   └── services.ts        - Product list API service calls
├── components/
│   ├── Button.tsx         - Reusable button optimized with React.memo
│   ├── SearchBar.tsx      - Search input with clear handlers
│   ├── ScreenWrapper.tsx  - Reusable safe area and status bar wrapper
│   ├── FurnitureCardGrid.tsx - Grid-layout card with custom add icon image
│   └── FurnitureCardList.tsx - List-layout card with proper buttons and typography
├── constants/
│   ├── colors.ts          - Theme colors
│   ├── theme.ts           - Typography and layout tokens
│   └── images.ts          - Local image asset map
├── redux/
│   ├── store.ts           - Persisted Redux store configuration
│   └── slices/
│       ├── furnitureSlice.ts - Product list, search query, viewMode, onboarding
│       ├── cartSlice.ts      - Shopping bag quantities and items
│       ├── likesSlice.ts     - Wishlist liked items array
│       ├── loaderSlice.ts    - Global loader indicator state
│       └── userDataSlice.ts  - Profile details and checkout order count
├── routes/
│   ├── AppNavigator.tsx   - Entry router (onboarding vs main application)
│   └── TabNavigator.tsx   - Bottom tab navigator with notch offsets
├── screens/
│   ├── IntroScreen.tsx    - Welcome onboarding screen
│   ├── HomeScreen.tsx     - Explore search screen with SectionList grouping
│   ├── LikesScreen.tsx    - User wishlisted items
│   ├── BagScreen.tsx      - Checkout shopping bag
│   ├── ProductDetailScreen.tsx - Details screen with swipeable carousel
│   ├── ProfileScreen.tsx  - Dynamic profile page with user stats
│   └── SettingsScreen.tsx - Settings screen with onboarding reset
└── utils/
    └── responsive.ts      - Device responsive height/width utilities
```

---

## ⚡ Running & Verification

### Run Metro Bundler
Start the local Expo development server:
```bash
npm run start
# or
npx expo start
```

### TypeScript Validation
To run compile checks and ensure clean typing:
```bash
npx tsc --noEmit
```
*Current compile status: **0 errors, 100% clean.***
=======
# Product-world
Products World is a modern React Native mobile application that allows users to explore products in both list and grid views with a clean, Figma-inspired UI. The app efficiently handles large datasets and organizes products using date-wise grouping such as Today, Yesterday, and Older for better user experience.
>>>>>>> 04c8c19de7f60bb3372f39173fda72e813bb2636
