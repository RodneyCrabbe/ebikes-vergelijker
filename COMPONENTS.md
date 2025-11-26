# 🧩 Component Library

This document provides comprehensive documentation for the E-Bike Platform component library.

## 📋 Table of Contents

- [Core Components](#core-components)
- [Layout Components](#layout-components)
- [Form Components](#form-components)
- [Data Display Components](#data-display-components)
- [Navigation Components](#navigation-components)
- [Feedback Components](#feedback-components)
- [AI Components](#ai-components)
- [Utility Components](#utility-components)

## 🎯 Core Components

### EBikeCard
Displays e-bike information in a card format.

```vue
<template>
  <EBikeCard
    :ebike="ebike"
    @view-details="handleViewDetails"
    @add-to-favorites="handleAddToFavorites"
    @add-to-comparison="handleAddToComparison"
  />
</template>
```

**Props:**
- `ebike` (Object, required): E-bike data object
- `showActions` (Boolean, default: true): Show action buttons
- `variant` (String, default: 'default'): Card variant ('default', 'compact', 'detailed')

**Events:**
- `view-details`: Emitted when card is clicked
- `add-to-favorites`: Emitted when favorite button is clicked
- `add-to-comparison`: Emitted when comparison button is clicked

**Slots:**
- `actions`: Custom action buttons
- `image`: Custom image content
- `content`: Custom content area

### EBikeList
Displays a list of e-bike cards with filtering and sorting.

```vue
<template>
  <EBikeList
    :ebikes="ebikes"
    :loading="loading"
    :filters="filters"
    @filter-change="handleFilterChange"
    @sort-change="handleSortChange"
  />
</template>
```

**Props:**
- `ebikes` (Array, required): Array of e-bike objects
- `loading` (Boolean, default: false): Loading state
- `filters` (Object, default: {}): Active filters
- `sortBy` (String, default: 'name'): Sort field
- `sortOrder` (String, default: 'asc'): Sort order

**Events:**
- `filter-change`: Emitted when filters change
- `sort-change`: Emitted when sort changes
- `ebike-click`: Emitted when e-bike is clicked

### EBikeDetail
Displays detailed e-bike information.

```vue
<template>
  <EBikeDetail
    :ebike="ebike"
    :reviews="reviews"
    :loading="loading"
    @add-to-favorites="handleAddToFavorites"
    @add-to-comparison="handleAddToComparison"
    @book-test-ride="handleBookTestRide"
  />
</template>
```

**Props:**
- `ebike` (Object, required): E-bike data object
- `reviews` (Array, default: []): E-bike reviews
- `loading` (Boolean, default: false): Loading state
- `showActions` (Boolean, default: true): Show action buttons

**Events:**
- `add-to-favorites`: Emitted when favorite button is clicked
- `add-to-comparison`: Emitted when comparison button is clicked
- `book-test-ride`: Emitted when test ride is booked

## 🏗️ Layout Components

### Header
Main navigation header component.

```vue
<template>
  <Header
    :user="user"
    :notifications="notifications"
    @login="handleLogin"
    @logout="handleLogout"
    @search="handleSearch"
  />
</template>
```

**Props:**
- `user` (Object, default: null): Current user object
- `notifications` (Array, default: []): User notifications
- `showSearch` (Boolean, default: true): Show search bar
- `showNotifications` (Boolean, default: true): Show notifications

**Events:**
- `login`: Emitted when login is requested
- `logout`: Emitted when logout is requested
- `search`: Emitted when search is performed

### Footer
Main footer component.

```vue
<template>
  <Footer
    :links="footerLinks"
    :social-links="socialLinks"
  />
</template>
```

**Props:**
- `links` (Array, default: []): Footer links
- `social-links` (Array, default: []): Social media links
- `show-newsletter` (Boolean, default: true): Show newsletter signup

### Sidebar
Collapsible sidebar component.

```vue
<template>
  <Sidebar
    :open="sidebarOpen"
    :items="sidebarItems"
    @close="handleClose"
    @item-click="handleItemClick"
  />
</template>
```

**Props:**
- `open` (Boolean, default: false): Sidebar open state
- `items` (Array, required): Sidebar menu items
- `variant` (String, default: 'default'): Sidebar variant

**Events:**
- `close`: Emitted when sidebar is closed
- `item-click`: Emitted when menu item is clicked

## 📝 Form Components

### SearchForm
Advanced search form component.

```vue
<template>
  <SearchForm
    v-model="searchQuery"
    :filters="filters"
    :loading="loading"
    @search="handleSearch"
    @filter-change="handleFilterChange"
  />
</template>
```

**Props:**
- `modelValue` (String, required): Search query
- `filters` (Object, default: {}): Available filters
- `loading` (Boolean, default: false): Loading state
- `placeholder` (String, default: 'Search e-bikes...'): Input placeholder

**Events:**
- `update:modelValue`: Emitted when search query changes
- `search`: Emitted when search is performed
- `filter-change`: Emitted when filters change

### ReviewForm
E-bike review submission form.

```vue
<template>
  <ReviewForm
    :ebike="ebike"
    :loading="loading"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>
```

**Props:**
- `ebike` (Object, required): E-bike being reviewed
- `loading` (Boolean, default: false): Loading state
- `user` (Object, default: null): Current user

**Events:**
- `submit`: Emitted when review is submitted
- `cancel`: Emitted when form is cancelled

### ContactForm
Contact form component.

```vue
<template>
  <ContactForm
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
```

**Props:**
- `loading` (Boolean, default: false): Loading state
- `subject` (String, default: ''): Pre-filled subject

**Events:**
- `submit`: Emitted when form is submitted

## 📊 Data Display Components

### StarRating
Star rating display component.

```vue
<template>
  <StarRating
    :rating="rating"
    :max-rating="5"
    :readonly="readonly"
    @rating-change="handleRatingChange"
  />
</template>
```

**Props:**
- `rating` (Number, required): Current rating
- `max-rating` (Number, default: 5): Maximum rating
- `readonly` (Boolean, default: false): Read-only mode
- `size` (String, default: 'medium'): Size variant

**Events:**
- `rating-change`: Emitted when rating changes

### PriceDisplay
Price display component with formatting.

```vue
<template>
  <PriceDisplay
    :price="price"
    :currency="'EUR'"
    :show-savings="true"
    :original-price="originalPrice"
  />
</template>
```

**Props:**
- `price` (Number, required): Current price
- `currency` (String, default: 'EUR'): Currency code
- `show-savings` (Boolean, default: false): Show savings indicator
- `original-price` (Number, default: null): Original price for comparison

### ComparisonTable
E-bike comparison table component.

```vue
<template>
  <ComparisonTable
    :ebikes="ebikes"
    :specifications="specifications"
    @remove="handleRemove"
    @clear="handleClear"
  />
</template>
```

**Props:**
- `ebikes` (Array, required): E-bikes to compare
- `specifications` (Array, required): Specifications to display
- `max-items` (Number, default: 3): Maximum items to compare

**Events:**
- `remove`: Emitted when e-bike is removed
- `clear`: Emitted when comparison is cleared

### DataTable
Generic data table component.

```vue
<template>
  <DataTable
    :data="data"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    @sort="handleSort"
    @page-change="handlePageChange"
  />
</template>
```

**Props:**
- `data` (Array, required): Table data
- `columns` (Array, required): Column definitions
- `loading` (Boolean, default: false): Loading state
- `pagination` (Object, default: null): Pagination config

**Events:**
- `sort`: Emitted when column is sorted
- `page-change`: Emitted when page changes

## 🧭 Navigation Components

### Breadcrumb
Breadcrumb navigation component.

```vue
<template>
  <Breadcrumb
    :items="breadcrumbItems"
    @item-click="handleItemClick"
  />
</template>
```

**Props:**
- `items` (Array, required): Breadcrumb items
- `separator` (String, default: '/'): Separator character

**Events:**
- `item-click`: Emitted when breadcrumb item is clicked

### Pagination
Pagination component.

```vue
<template>
  <Pagination
    :current-page="currentPage"
    :total-pages="totalPages"
    :show-info="true"
    @page-change="handlePageChange"
  />
</template>
```

**Props:**
- `current-page` (Number, required): Current page
- `total-pages` (Number, required): Total pages
- `show-info` (Boolean, default: false): Show page info
- `max-visible` (Number, default: 5): Maximum visible pages

**Events:**
- `page-change`: Emitted when page changes

### Tabs
Tab navigation component.

```vue
<template>
  <Tabs
    v-model="activeTab"
    :tabs="tabs"
    @tab-change="handleTabChange"
  />
</template>
```

**Props:**
- `modelValue` (String, required): Active tab
- `tabs` (Array, required): Tab definitions
- `variant` (String, default: 'default'): Tab variant

**Events:**
- `update:modelValue`: Emitted when active tab changes
- `tab-change`: Emitted when tab changes

## 💬 Feedback Components

### NotificationCenter
Notification center component.

```vue
<template>
  <NotificationCenter
    :notifications="notifications"
    :unread-count="unreadCount"
    @mark-read="handleMarkRead"
    @mark-all-read="handleMarkAllRead"
  />
</template>
```

**Props:**
- `notifications` (Array, required): User notifications
- `unread-count` (Number, default: 0): Unread count
- `max-height` (String, default: '400px'): Maximum height

**Events:**
- `mark-read`: Emitted when notification is marked as read
- `mark-all-read`: Emitted when all notifications are marked as read

### LoadingSpinner
Loading spinner component.

```vue
<template>
  <LoadingSpinner
    :size="'large'"
    :text="'Loading...'"
  />
</template>
```

**Props:**
- `size` (String, default: 'medium'): Size variant
- `text` (String, default: ''): Loading text
- `overlay` (Boolean, default: false): Show as overlay

### Alert
Alert message component.

```vue
<template>
  <Alert
    :type="'success'"
    :message="'Operation completed successfully'"
    :dismissible="true"
    @dismiss="handleDismiss"
  />
</template>
```

**Props:**
- `type` (String, required): Alert type ('success', 'error', 'warning', 'info')
- `message` (String, required): Alert message
- `dismissible` (Boolean, default: false): Show dismiss button
- `auto-dismiss` (Boolean, default: false): Auto dismiss after delay

**Events:**
- `dismiss`: Emitted when alert is dismissed

## 🤖 AI Components

### EnhancedAIChatbot
Enhanced AI chatbot component.

```vue
<template>
  <EnhancedAIChatbot
    :open="chatbotOpen"
    :user="user"
    @close="handleClose"
    @message="handleMessage"
  />
</template>
```

**Props:**
- `open` (Boolean, default: false): Chatbot open state
- `user` (Object, default: null): Current user
- `theme` (String, default: 'light'): Chatbot theme

**Events:**
- `close`: Emitted when chatbot is closed
- `message`: Emitted when message is sent

### RecommendationsSection
AI-powered recommendations component.

```vue
<template>
  <RecommendationsSection
    :user="user"
    :ebikes="ebikes"
    :loading="loading"
    @ebike-click="handleEBikeClick"
  />
</template>
```

**Props:**
- `user` (Object, default: null): Current user
- `ebikes` (Array, required): Recommended e-bikes
- `loading` (Boolean, default: false): Loading state
- `max-items` (Number, default: 6): Maximum items to show

**Events:**
- `ebike-click`: Emitted when e-bike is clicked

## 🛠️ Utility Components

### LazyImage
Lazy loading image component.

```vue
<template>
  <LazyImage
    :src="imageSrc"
    :alt="imageAlt"
    :placeholder="placeholderSrc"
    @load="handleLoad"
    @error="handleError"
  />
</template>
```

**Props:**
- `src` (String, required): Image source
- `alt` (String, required): Alt text
- `placeholder` (String, default: ''): Placeholder image
- `loading` (String, default: 'lazy'): Loading behavior

**Events:**
- `load`: Emitted when image loads
- `error`: Emitted when image fails to load

### Modal
Modal dialog component.

```vue
<template>
  <Modal
    :open="modalOpen"
    :title="'Confirm Action'"
    :size="'medium'"
    @close="handleClose"
  >
    <template #content>
      <p>Are you sure you want to proceed?</p>
    </template>
    <template #actions>
      <button @click="handleConfirm">Confirm</button>
      <button @click="handleCancel">Cancel</button>
    </template>
  </Modal>
</template>
```

**Props:**
- `open` (Boolean, required): Modal open state
- `title` (String, default: ''): Modal title
- `size` (String, default: 'medium'): Modal size
- `closable` (Boolean, default: true): Show close button

**Events:**
- `close`: Emitted when modal is closed

### Tooltip
Tooltip component.

```vue
<template>
  <Tooltip
    :content="'This is a tooltip'"
    :placement="'top'"
    :trigger="'hover'"
  >
    <button>Hover me</button>
  </Tooltip>
</template>
```

**Props:**
- `content` (String, required): Tooltip content
- `placement` (String, default: 'top'): Tooltip placement
- `trigger` (String, default: 'hover'): Trigger event

### Skeleton
Loading skeleton component.

```vue
<template>
  <Skeleton
    :type="'card'"
    :count="3"
    :animated="true"
  />
</template>
```

**Props:**
- `type` (String, required): Skeleton type ('card', 'text', 'image', 'button')
- `count` (Number, default: 1): Number of skeletons
- `animated` (Boolean, default: true): Show animation

## 🎨 Styling

### CSS Classes
All components use Tailwind CSS classes and follow the design system:

```css
/* Primary colors */
.text-primary-500 { color: #3b82f6; }
.bg-primary-500 { background-color: #3b82f6; }

/* Secondary colors */
.text-secondary-500 { color: #6b7280; }
.bg-secondary-500 { background-color: #6b7280; }

/* Success colors */
.text-success-500 { color: #10b981; }
.bg-success-500 { background-color: #10b981; }

/* Error colors */
.text-error-500 { color: #ef4444; }
.bg-error-500 { background-color: #ef4444; }
```

### Component Variants
Components support multiple variants:

```vue
<!-- Button variants -->
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

<!-- Size variants -->
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## 📱 Responsive Design

All components are fully responsive and work across all device sizes:

```vue
<template>
  <!-- Mobile-first approach -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <EBikeCard v-for="ebike in ebikes" :key="ebike.id" :ebike="ebike" />
  </div>
</template>
```

## ♿ Accessibility

All components follow WCAG 2.1 guidelines:

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## 🧪 Testing

Components include comprehensive tests:

```typescript
// Example component test
import { mount } from '@vue/test-utils'
import EBikeCard from '@/components/EBikeCard.vue'

describe('EBikeCard', () => {
  it('renders e-bike information correctly', () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })
    
    expect(wrapper.text()).toContain('City Pro')
    expect(wrapper.text()).toContain('€2,500')
  })
})
```

## 📦 Usage Examples

### Complete E-Bike List Page
```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <Header @search="handleSearch" />
    
    <SearchForm
      v-model="searchQuery"
      :filters="filters"
      @search="handleSearch"
    />
    
    <EBikeList
      :ebikes="filteredEBikes"
      :loading="loading"
      @ebike-click="handleEBikeClick"
    />
    
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>
```

### E-Bike Detail Page
```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <Breadcrumb :items="breadcrumbItems" />
    
    <EBikeDetail
      :ebike="ebike"
      :reviews="reviews"
      @add-to-favorites="handleAddToFavorites"
      @book-test-ride="handleBookTestRide"
    />
    
    <RecommendationsSection
      :user="user"
      :ebikes="recommendedEBikes"
    />
  </div>
</template>
```

## 🔧 Customization

### Theme Customization
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    }
  }
}
```

### Component Customization
```vue
<template>
  <EBikeCard
    :ebike="ebike"
    class="custom-ebike-card"
    :style="{ '--card-shadow': '0 10px 25px rgba(0,0,0,0.1)' }"
  />
</template>

<style>
.custom-ebike-card {
  --card-shadow: 0 10px 25px rgba(0,0,0,0.1);
  box-shadow: var(--card-shadow);
}
</style>
```
