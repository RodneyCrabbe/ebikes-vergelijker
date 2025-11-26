# 🧪 Testing Guide

This document provides comprehensive information about the testing suite for the E-Bike Platform.

## 📋 Test Structure

The testing suite is organized into four main categories:

### 1. Unit Tests (`src/test/unit/`)
- **Purpose**: Test individual components, stores, and services in isolation
- **Framework**: Vitest + Vue Test Utils
- **Coverage**: Functions, methods, and component logic
- **Location**: `src/test/unit/`

### 2. Integration Tests (`src/test/integration/`)
- **Purpose**: Test interactions between multiple components and services
- **Framework**: Vitest + Vue Test Utils
- **Coverage**: Component interactions, store integrations, API calls
- **Location**: `src/test/integration/`

### 3. Performance Tests (`src/test/performance/`)
- **Purpose**: Test application performance, memory usage, and optimization
- **Framework**: Vitest + Performance APIs
- **Coverage**: API response times, rendering performance, memory leaks
- **Location**: `src/test/performance/`

### 4. End-to-End Tests (`src/test/e2e/`)
- **Purpose**: Test complete user workflows and browser interactions
- **Framework**: Playwright
- **Coverage**: Full user journeys, cross-browser compatibility
- **Location**: `src/test/e2e/`

## 🚀 Running Tests

### All Tests
```bash
npm run test:all
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Performance Tests Only
```bash
npm run test:performance
```

### E2E Tests Only
```bash
npm run test:e2e
```

### Watch Mode (Unit/Integration/Performance)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### E2E Tests with UI
```bash
npm run test:e2e:ui
```

### E2E Tests in Headed Mode
```bash
npm run test:e2e:headed
```

## 📊 Test Coverage

The project maintains high test coverage with the following thresholds:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 🧩 Test Categories

### Unit Tests

#### Store Tests
- **`stores/ebikes.test.ts`**: E-bike data management
- **`stores/auth.test.ts`**: Authentication logic
- **`stores/favorites.test.ts`**: Favorites functionality
- **`stores/comparison.test.ts`**: Comparison features

#### Service Tests
- **`services/eventTrackingService.test.ts`**: Analytics tracking
- **`services/aiAgentService.test.ts`**: AI functionality
- **`services/webSearchService.test.ts`**: Web search integration

#### Component Tests
- **`components/EBikeCard.test.ts`**: E-bike card component
- **`components/EnhancedAIChatbot.test.ts`**: AI chatbot
- **`components/ReviewForm.test.ts`**: Review submission

### Integration Tests

#### User Flow Tests
- **`ebike-flow.test.ts`**: Complete e-bike browsing flow
- **`auth-flow.test.ts`**: User authentication flow
- **`comparison-flow.test.ts`**: E-bike comparison workflow

#### API Integration Tests
- **`api-integration.test.ts`**: Supabase API interactions
- **`payment-integration.test.ts`**: Payment processing
- **`notification-integration.test.ts`**: Notification system

### Performance Tests

#### API Performance
- Response time testing
- Large dataset handling
- Caching effectiveness

#### Rendering Performance
- Component render times
- Image lazy loading
- List virtualization

#### Memory Management
- Memory leak detection
- Large dataset processing
- Component lifecycle management

### E2E Tests

#### User Journeys
- **`ebike-platform.spec.ts`**: Complete platform testing
- **`user-registration.spec.ts`**: User onboarding
- **`e-bike-purchase.spec.ts`**: Purchase flow

#### Cross-Browser Testing
- Chrome, Firefox, Safari
- Mobile Chrome, Mobile Safari
- Responsive design testing

## 🔧 Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './src/test/e2e',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

## 🛠️ Test Utilities

### Mock Data
```typescript
// src/test/setup.ts
global.testUtils = {
  createMockUser: () => ({
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: { full_name: 'Test User' }
  }),
  createMockEBike: () => ({
    id: 'test-ebike-id',
    model_name: 'Test E-Bike',
    brand: 'Test Brand',
    price: 2500
  })
}
```

### Mock Services
- Supabase client mocking
- API response mocking
- Browser API mocking (IntersectionObserver, SpeechRecognition, etc.)

## 📝 Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EBikeCard from '@/components/EBikeCard.vue'

describe('EBikeCard', () => {
  it('should render e-bike information', () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })
    
    expect(wrapper.text()).toContain('Test E-Bike')
    expect(wrapper.text()).toContain('€2,500')
  })
})
```

### Integration Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'

describe('E-Bike Flow', () => {
  it('should navigate from home to detail page', async () => {
    const wrapper = mount(HomePage, {
      global: { plugins: [createPinia()] }
    })
    
    await wrapper.find('[data-testid="ebike-card"]').trigger('click')
    expect(wrapper.emitted('navigate')).toBeTruthy()
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'

test('should display home page', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('nav')).toBeVisible()
  await expect(page.locator('[data-testid="featured-ebikes"]')).toBeVisible()
})
```

## 🐛 Debugging Tests

### Unit/Integration Tests
```bash
# Run specific test file
npm run test:unit -- src/test/unit/stores/ebikes.test.ts

# Run with verbose output
npm run test:watch -- --reporter=verbose

# Debug mode
npm run test:watch -- --inspect-brk
```

### E2E Tests
```bash
# Run with UI
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Run specific test
npx playwright test ebike-platform.spec.ts
```

## 📈 Continuous Integration

Tests are automatically run in CI/CD pipeline:
1. **Unit Tests**: Run on every commit
2. **Integration Tests**: Run on pull requests
3. **Performance Tests**: Run on main branch
4. **E2E Tests**: Run on deployment

## 🎯 Best Practices

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Mocking
- Mock external dependencies
- Use realistic mock data
- Clean up mocks between tests

### Performance
- Test with realistic data sizes
- Monitor memory usage
- Test edge cases and error conditions

### Maintenance
- Keep tests up to date with code changes
- Remove obsolete tests
- Refactor tests when refactoring code

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Vue.js Applications](https://vuejs.org/guide/scaling-up/testing.html)
