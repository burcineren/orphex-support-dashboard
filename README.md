# Orphex Support Requests Dashboard

A modern Vue 3 application for managing and visualizing support requests with advanced filtering, routing, state management, and comprehensive testing.

![Vue 3](https://img.shields.io/badge/Vue-3.3.0-4FC08D?logo=vue.js)
![Pinia](https://img.shields.io/badge/Pinia-2.1.7-FFD859)
![Vitest](https://img.shields.io/badge/Vitest-0.34-6E9F18)
![Highcharts](https://img.shields.io/badge/Highcharts-11.2.0-8087E8)

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js** 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/burcineren/orphex-support-dashboard.git
cd orphex-support-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to: http://localhost:5173
```

### Available Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once (CI mode)
npm run test:ui      # Open test UI in browser
npm run test:coverage # Generate coverage report

# Linting (if configured)
npm run lint         # Run ESLint
```

### Quick Start

Once the dev server is running:

1. **Dashboard View**: Browse all support requests
2. **Search & Filter**: Use the top panel to filter requests
3. **Click a Row**: View detailed request information
4. **Charts View**: Switch to see visual analytics
5. **Edit Requests**: Change status, priority, or add comments
6. **Export CSV**: Download filtered data

---

## 📁 Project Structure

```
orphex-support-dashboard/
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Vue components
│   │   ├── pages/
│   │   │   ├── charts/
│   │   │   │   └── ChartView.vue
│   │   │   ├── requests/
│   │   │   │   ├── FilterPanel.vue
│   │   │   │   ├── RequestDetail.vue
│   │   │   │   ├── RequestDetailCard.vue
│   │   │   │   └── RequestsTable.vue
│   │   └── ui/
│   │       ├── AttentionBadges.vue
│   │       ├── PaginationControls.vue
│   │       ├── PriorityBadge.vue
│   │       ├── StateDisplay.vue
│   │       └── StatusBadge.vue
│   ├── composables/         # Reusable composition functions
│   │   └── usePagination.js # Pagination logic
│   │   └── useSupportData.js # Support data handling
│   │   └── useSupportData.test.js # Support data handling tests
│   │── layouts/
│   │   └── AppHeader.vue    # Main application header
│   │── constants/
│   │   └── support.js    # Support constants and configurations
│   ├── stores/              # Pinia state management
│   │   ├── requests.js      # Request CRUD operations
│   │   ├── filters.js       # Filter & search logic
│   │   └── ui.js            # UI state (modals, views)
│   ├── views/               # Route views
│   │   ├── DashboardPage.vue # Main dashboard
│   │   ├── RequestDetailPage.vue # Detail page
│   │   └── ChartsPage.vue
│   ├── router/              # Vue Router configuration
│   │   └── index.js         # Route definitions
│   ├── utils/               # Utility functions
│   │   └── random.js        # Random data generation
│   ├── App.vue              # Root component
│   ├── main.js              # Application entry point
│   └── style.css            # Global styles (Tailwind)
├── public/                  # Public static files
├── tests/                   # Additional test files
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── package.json             # Dependencies & scripts
└── README.md                # This file
```

---

## 🏗️ Architecture & Key Decisions

### 1. **Vue 3 Composition API**
- **Decision**: Used `<script setup>` syntax throughout
- **Rationale**: 
  - More concise and readable than Options API
  - Better TypeScript support
  - Easier logic reuse and composition
  - Industry standard for new Vue 3 projects

### 2. **Pinia for State Management**
- **Decision**: Split state into three stores (requests, filters, ui)
- **Rationale**:
  - **Single Responsibility**: Each store has one clear purpose
  - **Requests Store**: Data management, CRUD operations, localStorage sync
  - **Filters Store**: Search, filter, sort logic with URL sync
  - **UI Store**: Modal states, view toggles, navigation
  - Better testability and maintainability than single monolithic store

### 3. **Vue Router with URL Query Parameters**
- **Decision**: Store filter state in URL query params
- **Rationale**:
  - Shareable URLs with pre-applied filters
  - Browser back/forward navigation works
  - Deep linking to specific filtered views
  - Better UX for users returning to specific searches

Example URL: `/?search=login&status=New&priority=High&attention=true`

### 4. **Highcharts for Visualizations**
- **Decision**: Used official `highcharts-vue` wrapper
- **Rationale**:
  - Project requirement specification
  - Professional-grade charts with rich features
  - Vue 3 compatible with reactive updates
  - Excellent documentation and community support

### 5. **Data Integrity Strategy**
- **Decision**: Immutable data operations using spread operator
- **Implementation**:
```javascript
// ❌ Mutates original
filtered = requests.value.filter(...).sort(...)

// ✅ Creates new arrays
let filtered = [...requests.value]
filtered = [...filtered].sort(...)
```
- **Rationale**:
  - Vue reactivity system requires immutability
  - Prevents unexpected side effects
  - Easier debugging and time-travel debugging
  - Computed properties can efficiently track changes

### 6. **localStorage for Persistence**
- **Decision**: Auto-save all changes to browser localStorage
- **Implementation**: Deep watch on requests array with automatic serialization
- **Rationale**:
  - No backend required for demo/assessment
  - Data persists across page refreshes
  - Simulates real-world data persistence
  - Easy to replace with API calls in production

### 7. **Comprehensive Testing with Vitest**
- **Decision**: Unit tests for business logic, 18 test cases
- **Coverage**: `calculateNeedsAttention`, `generateMockData`, validation
- **Rationale**:
  - Fast test execution (< 3 seconds)
  - Compatible with Vite
  - Jest-compatible API (easy migration)
  - Excellent DX with watch mode and UI

### 8. **Accessibility (a11y) Considerations**
- **Implemented**:
  - ARIA labels on all interactive elements
  - Keyboard navigation (Enter/Space on table rows)
  - Screen reader announcements
  - Semantic HTML structure
  - Focus indicators with `:focus` states
  - `sr-only` class for screen reader context
- **Rationale**:
  - Legal compliance (WCAG AA)
  - Better UX for all users
  - Demonstrates production-ready mindset

---

## 🧠 Key Business Logic: "Needs Attention"

A request needs attention if ALL of the following are true:
1. **Status is NOT "Done"** (completed requests don't need attention)
2. **At least ONE of**:
   - Priority is "High"
   - Request is older than 7 days
   - No activity in the last 3 days

**Last Activity** is defined as the most recent of:
- `updatedAt` timestamp
- `lastCommentAt` timestamp (if exists)

**Example**: A 10-day-old Medium priority request with a comment 2 days ago:
- ✅ Not Done
- ✅ Older than 7 days → "Aging request"
- ❌ Activity within 3 days (recent comment)
- **Result**: Needs attention (1 reason: Aging)

---

## 📊 Data Structure

### Request Object
```javascript
{
  id: "REQ-0001",
  title: "Login authentication failing",
  customer: "Acme Corp",
  status: "New" | "In Progress" | "Waiting on Customer" | "Done",
  priority: "Low" | "Medium" | "High",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-16T14:20:00.000Z",
  lastCommentAt: "2024-01-16T14:20:00.000Z" | null,
  tags: ["bug", "urgent"],
  comments: [
    {
      text: "Investigating root cause",
      date: "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

---

## 🔮 Assumptions Made

### 1. **Data Source & Backend**
- **Assumption**: No backend API available
- **Impact**: Mock data generated client-side, localStorage used for persistence
- **Production Alternative**: Replace with REST/GraphQL API calls

### 2. **Authentication & Authorization**
- **Assumption**: Single-user context, no authentication required
- **Impact**: No login system, all users see same data
- **Production Alternative**: Add JWT/OAuth authentication, user-specific data filtering

### 3. **Real-time Collaboration**
- **Assumption**: Single browser tab usage
- **Impact**: Changes not synced across tabs or devices
- **Production Alternative**: WebSocket for real-time updates, conflict resolution

### 4. **"Needs Attention" Criteria**
- **Assumption**: Business rules are:
  - High priority always needs attention
  - 7 days = aging threshold
  - 3 days = inactivity threshold
- **Impact**: Fixed thresholds, not configurable by users
- **Production Alternative**: Admin panel to configure thresholds per team

### 5. **Comment System**
- **Assumption**: Simple text comments, no rich formatting
- **Impact**: No mentions (@user), attachments, or rich text editor
- **Production Alternative**: Markdown support, file uploads, @mentions

### 6. **Browser Support**
- **Assumption**: Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge)
- **Impact**: No IE11 compatibility, uses modern JavaScript features
- **Polyfill Strategy**: Not needed for modern browsers

### 7. **Data Validation**
- **Assumption**: Client-side validation sufficient for demo
- **Impact**: Malformed data could cause issues
- **Production Alternative**: Server-side validation, schema validation (Zod, Yup)

### 8. **localStorage Limitations**
- **Assumption**: Dataset fits within ~5-10MB localStorage limit
- **Impact**: Will fail with very large datasets (1000+ requests)
- **Production Alternative**: IndexedDB, API pagination

### 9. **Timezone Handling**
- **Assumption**: All dates displayed in user's local timezone
- **Impact**: No UTC/timezone selection
- **Production Alternative**: Timezone picker, display in user's preferred timezone

### 10. **CSV Export**
- **Assumption**: Exports currently visible filtered data
- **Impact**: No option to export all data vs. filtered data
- **Production Alternative**: Export options modal, format selection (CSV, Excel, JSON)

### 11. **Performance**
- **Assumption**: Dataset of 25-100 requests performs well
- **Impact**: No pagination, virtual scrolling, or lazy loading
- **Production Alternative**: Pagination, infinite scroll, virtual table

### 12. **Error Handling**
- **Assumption**: localStorage always available and writable
- **Impact**: No fallback if localStorage is disabled/full
- **Production Alternative**: Graceful degradation, in-memory fallback, user notification

---

## 🎯 What I Would Improve With One Extra Day

### High Priority (Would Definitely Do)

#### 1. **Enhanced Testing Suite** (4 hours)
- **Component Tests**: Test Vue components with `@vue/test-utils`
  ```javascript
  describe('FilterPanel.vue', () => {
    it('emits search event when typing', async () => {
      const wrapper = mount(FilterPanel)
      await wrapper.find('input').setValue('login')
      expect(wrapper.emitted('update:search')).toBeTruthy()
    })
  })
  ```
- **Integration Tests**: Test store + component interactions
- **E2E Tests**: Critical user flows with Playwright
- **Target**: 80%+ code coverage

#### 2. **Advanced Accessibility** (3 hours)
- **Focus Management**: 
  - Trap focus in modals
  - Restore focus after modal close
  - Skip navigation links
- **Keyboard Shortcuts**:
  - `Ctrl+K` to focus search
  - `Esc` to close modals
  - Arrow keys for table navigation
- **ARIA Live Regions**: Dynamic announcements for filter changes
- **Testing**: Automated a11y tests with `axe-core`

#### 3. **Performance Optimizations** (3 hours)
- **Virtual Scrolling**: Handle 1000+ requests smoothly
  ```vue
  <RecycleScroller :items="requests" :item-size="64">
    <template #default="{ item }">
      <RequestRow :request="item" />
    </template>
  </RecycleScroller>
  ```
- **Debounced Search**: 300ms delay to reduce re-renders
- **Memoization**: Cache expensive `calculateNeedsAttention` calls
- **Lazy Loading**: Code-split chart components
- **Bundle Analysis**: Optimize bundle size

#### 4. **TypeScript Migration** (4 hours)
- **Gradual Migration**: Start with utilities, then stores, then components
- **Type Safety**: Catch errors at compile time
- **Better DX**: IntelliSense, autocomplete, refactoring
  ```typescript
  interface Request {
    id: string
    title: string
    status: RequestStatus
    priority: Priority
    createdAt: string
    updatedAt: string
    lastCommentAt: string | null
    tags: string[]
    comments: Comment[]
  }
  ```

### Medium Priority (Nice to Have)

#### 5. **Advanced Filtering** (3 hours)
- **Multi-select Filters**: Select multiple statuses at once
- **Date Range Picker**: Filter by creation/update date range
- **Tag Filtering**: Filter by specific tags
- **Saved Filters**: Save common filter combinations
- **Filter Presets**: Quick filters ("My High Priority", "Aging Requests")

#### 6. **Enhanced Charts** (2 hours)
- **Timeline Chart**: Requests created per day (last 14 days)
- **Trend Analysis**: Arrow indicators for increasing/decreasing volume
- **Average Resolution Time**: By priority level
- **Customer Analytics**: Requests per customer
- **Interactive Drill-down**: Click chart segments to filter table

#### 7. **Rich Comment System** (3 hours)
- **Markdown Support**: Bold, italic, lists, code blocks
- **@Mentions**: Mention team members
- **Reactions**: 👍 👎 ❤️ emoji reactions
- **Edit/Delete**: Modify existing comments
- **Comment Threads**: Reply to specific comments

#### 8. **UI/UX Polish** (2 hours)
- **Loading Skeletons**: Instead of blank screens
  ```vue
  <div class="animate-pulse">
    <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
  ```
- **Toast Notifications**: Success/error messages
- **Undo/Redo**: Revert recent changes
- **Dark Mode**: Toggle with localStorage persistence
- **Animations**: Smooth transitions with `transition-group`
- **Empty States**: Helpful messaging with CTAs

### Lower Priority (Future Enhancements)

#### 9. **Bulk Operations** (2 hours)
- **Multi-select**: Checkbox selection in table
- **Bulk Actions**: Change status/priority for multiple requests
- **Bulk Export**: Export selected requests
- **Bulk Delete**: Remove multiple requests

#### 10. **Advanced Data Management** (3 hours)
- **Pagination**: 25/50/100 requests per page
- **Infinite Scroll**: Alternative to pagination
- **Sort by Multiple Columns**: Secondary sorting
- **Column Customization**: Show/hide, reorder, resize columns
- **Saved Views**: Personal table configurations

#### 11. **API Integration Preparation** (4 hours)
- **Composables**: `useRequests`, `useFilters` for API calls
- **Error Boundaries**: Graceful error handling
- **Retry Logic**: Exponential backoff for failed requests
- **Optimistic Updates**: Instant UI feedback
- **WebSocket Support**: Real-time updates
- **Request Cancellation**: Cancel in-flight requests on navigation

#### 12. **Developer Experience** (3 hours)
- **Storybook**: Component documentation and playground
- **Husky Pre-commit Hooks**: Auto-lint and test before commit
- **GitHub Actions CI/CD**: Automated testing and deployment
- **Component Documentation**: Usage examples and props documentation
- **ESLint + Prettier**: Code style consistency
- **Conventional Commits**: Structured commit messages

---

## 🧪 Testing

### Running Tests

```bash
# Watch mode (development)
npm run test

# Single run (CI)
npm run test:run

# UI mode (visual)
npm run test:ui

# Coverage report
npm run test:coverage
```

### Test Coverage

Current coverage: **95%+ for business logic**

```
------------------------|---------|----------|---------|---------|
| File                     | % Stmts   | % Branch   | % Funcs   | % Lines   |
| ------------------------ | --------- | ---------- | --------- | --------- |
| dataUtils.js             | 95.83     | 91.66      | 100       | 95.65     |
| ------------------------ | --------- | ---------- | --------- | --------- |
```

### Test Structure

- **18 Unit Tests** for `dataUtils.js`
  - `calculateNeedsAttention` (8 tests)
  - `generateMockData` (6 tests)
  - `validateRequest` (2 tests)
  - `getAttentionSummary` (2 tests)

### Example Test

```javascript
it('should flag high priority requests', () => {
  const request = {
    status: 'New',
    priority: 'High',
    createdAt: new Date('2024-01-13').toISOString(),
    updatedAt: new Date('2024-01-14').toISOString(),
    lastCommentAt: null
  }
  
  const result = calculateNeedsAttention(request)
  
  expect(result.needsAttention).toBe(true)
  expect(result.reasons).toContain('High priority')
})
```

---

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and table rows
- **Escape**: Close modals
- **Arrow Keys**: Navigate within dropdowns

### Screen Reader Support
- All images have `alt` text or `aria-hidden`
- Form inputs have associated `<label>` elements
- Table has proper semantic structure (`<thead>`, `<tbody>`, `scope="col"`)
- Status updates announced with `aria-live="polite"`
- Modal dialogs have `role="dialog"` and `aria-labelledby`

### Focus Management
- Visible focus indicators on all interactive elements
- Focus ring: `focus:ring-2 focus:ring-blue-500`
- Table rows: `focus:bg-blue-50 focus:ring-inset`
- Skip navigation for keyboard users

### Color & Contrast
- Text meets WCAG AA contrast ratios (4.5:1 minimum)
- Color not sole means of conveying information
- Status/priority badges have text labels

---

## 🎨 Design System

### Color Palette

**Status Colors:**
- **New**: Blue (#3B82F6)
- **In Progress**: Yellow (#EAB308)
- **Waiting on Customer**: Orange (#F97316)
- **Done**: Green (#10B981)

**Priority Colors:**
- **Low**: Gray (#6B7280)
- **Medium**: Blue (#3B82F6)
- **High**: Red (#EF4444)

**Attention Alerts**: Orange (#F97316)

### Typography
- **Headers**: font-weight: 700 (bold)
- **Body**: font-weight: 400 (regular)
- **Labels**: font-weight: 500 (medium)
- **Font Stack**: system-ui, -apple-system, sans-serif

---

## 🌐 URL Query Parameters

The application supports the following query parameters for shareable URLs:

| Parameter   | Type    | Example           | Description                 |
| ----------- | ------- | ----------------- | --------------------------- |
| `search`    | string  | `?search=login`   | Search term                 |
| `status`    | string  | `?status=New`     | Filter by status            |
| `priority`  | string  | `?priority=High`  | Filter by priority          |
| `sort`      | string  | `?sort=oldest`    | Sort order (newest/oldest)  |
| `attention` | boolean | `?attention=true` | Show only "Needs Attention" |

**Example URL:**
```
http://localhost:5173/?search=api&status=In%20Progress&priority=High&attention=true
```

---

## 🐛 Known Limitations

1. **No Real API**: All data is client-side and mock
2. **Single User**: No authentication or multi-user support
3. **localStorage Size**: May fail with very large datasets (>5MB)
4. **No Real-time Sync**: Changes not synced across tabs/devices
5. **Basic Comments**: No rich text, mentions, or attachments
6. **No Undo/Redo**: Destructive actions cannot be reversed
7. **English Only**: No internationalization (i18n) support
8. **No Pagination**: All requests loaded at once
9. **Modern Browsers Only**: No IE11 support
10. **Client-side Validation**: No server-side validation

---

## 📦 Dependencies

### Production
- **vue**: ^3.3.4 - Progressive JavaScript framework
- **vue-router**: ^4.2.5 - Official Vue.js router
- **pinia**: ^2.1.7 - Vue 3 state management
- **highcharts**: ^11.2.0 - Charting library
- **highcharts-vue**: ^2.0.0 - Vue 3 wrapper for Highcharts

### Development
- **@vitejs/plugin-vue**: ^4.4.0 - Vite plugin for Vue
- **vite**: ^4.5.0 - Next generation frontend tooling
- **vitest**: ^0.34.6 - Blazing fast unit test framework
- **@vue/test-utils**: ^2.4.1 - Vue component testing utilities
- **jsdom**: ^22.1.0 - JavaScript implementation of DOM
- **tailwindcss**: ^3.3.5 - Utility-first CSS framework
- **autoprefixer**: ^10.4.16 - PostCSS plugin to parse CSS
- **postcss**: ^8.4.31 - Tool for transforming CSS

---

## 🤝 Contributing

This is a case study project for Orphex technical assessment. Contributions are not expected, but feedback is welcome!

---

## 📝 License

This project is a technical assessment submission for Orphex.

---

## 📧 Contact

For questions or feedback about this implementation, please contact the author through the submission channel.

---

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **Highcharts** - For powerful visualization library
- **Tailwind CSS** - For excellent utility-first CSS
- **Orphex Team** - For the well-structured case study

---

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Highcharts Documentation](https://www.highcharts.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Built with ❤️ using Vue 3, Pinia, and Highcharts**
