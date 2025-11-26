import { test, expect } from '@playwright/test'

test.describe('E-Bike Platform E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://127.0.0.1:5173/')
  })

  test('should display home page with featured e-bikes', async ({ page }) => {
    // Check if the page loads correctly
    await expect(page).toHaveTitle(/E-Bike Platform/)
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible()
    
    // Check for featured e-bikes section
    await expect(page.locator('[data-testid="featured-ebikes"]')).toBeVisible()
    
    // Check for at least one e-bike card
    const ebikeCards = page.locator('[data-testid="ebike-card"]')
    await expect(ebikeCards.first()).toBeVisible()
  })

  test('should navigate to e-bike list page', async ({ page }) => {
    // Click on "Alle E-Bikes" or similar navigation link
    await page.click('text=Alle E-Bikes')
    
    // Should be on the list page
    await expect(page).toHaveURL(/.*\/ebikes/)
    
    // Check for e-bike list
    await expect(page.locator('[data-testid="ebike-list"]')).toBeVisible()
  })

  test('should search for e-bikes', async ({ page }) => {
    // Navigate to list page
    await page.click('text=Alle E-Bikes')
    
    // Use search functionality
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.fill('city')
    await searchInput.press('Enter')
    
    // Check if search results are displayed
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
  })

  test('should filter e-bikes by category', async ({ page }) => {
    // Navigate to list page
    await page.click('text=Alle E-Bikes')
    
    // Click on category filter
    await page.click('[data-testid="category-filter"]')
    await page.click('text=Stad')
    
    // Check if filtered results are shown
    await expect(page.locator('[data-testid="filtered-results"]')).toBeVisible()
  })

  test('should view e-bike details', async ({ page }) => {
    // Navigate to list page
    await page.click('text=Alle E-Bikes')
    
    // Click on first e-bike card
    await page.click('[data-testid="ebike-card"]:first-child')
    
    // Should be on detail page
    await expect(page).toHaveURL(/.*\/ebike\/.*/)
    
    // Check for e-bike details
    await expect(page.locator('[data-testid="ebike-details"]')).toBeVisible()
    await expect(page.locator('[data-testid="ebike-name"]')).toBeVisible()
    await expect(page.locator('[data-testid="ebike-price"]')).toBeVisible()
  })

  test('should add e-bike to favorites', async ({ page }) => {
    // First, need to be logged in
    await page.click('text=Inloggen')
    
    // Fill login form (assuming test user exists)
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // Wait for login to complete
    await expect(page.locator('text=Uitloggen')).toBeVisible()
    
    // Navigate to e-bike list
    await page.click('text=Alle E-Bikes')
    
    // Click favorite button on first e-bike
    await page.click('[data-testid="favorite-button"]:first-child')
    
    // Check if favorite was added (visual feedback)
    await expect(page.locator('[data-testid="favorite-button"]:first-child')).toHaveClass(/text-red-500/)
  })

  test('should add e-bike to comparison', async ({ page }) => {
    // Navigate to e-bike list
    await page.click('text=Alle E-Bikes')
    
    // Click compare button on first e-bike
    await page.click('[data-testid="compare-button"]:first-child')
    
    // Check if comparison counter is updated
    await expect(page.locator('[data-testid="comparison-counter"]')).toContainText('1')
    
    // Add second e-bike to comparison
    await page.click('[data-testid="compare-button"]:nth-child(2)')
    
    // Check if comparison counter is updated
    await expect(page.locator('[data-testid="comparison-counter"]')).toContainText('2')
  })

  test('should view comparison page', async ({ page }) => {
    // Add e-bikes to comparison first
    await page.click('text=Alle E-Bikes')
    await page.click('[data-testid="compare-button"]:first-child')
    await page.click('[data-testid="compare-button"]:nth-child(2)')
    
    // Click on comparison link
    await page.click('[data-testid="view-comparison"]')
    
    // Should be on comparison page
    await expect(page).toHaveURL(/.*\/compare/)
    
    // Check for comparison table
    await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible()
  })

  test('should book test ride appointment', async ({ page }) => {
    // Login first
    await page.click('text=Inloggen')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // Navigate to e-bike detail
    await page.click('text=Alle E-Bikes')
    await page.click('[data-testid="ebike-card"]:first-child')
    
    // Click book test ride button
    await page.click('[data-testid="book-test-ride"]')
    
    // Fill appointment form
    await page.fill('[data-testid="appointment-date"]', '2024-12-25')
    await page.fill('[data-testid="appointment-time"]', '14:00')
    await page.fill('[data-testid="appointment-notes"]', 'Test ride appointment')
    
    // Submit form
    await page.click('[data-testid="submit-appointment"]')
    
    // Check for success message
    await expect(page.locator('text=Afspraak ingepland')).toBeVisible()
  })

  test('should access user profile', async ({ page }) => {
    // Login first
    await page.click('text=Inloggen')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // Click on profile link
    await page.click('text=Profiel')
    
    // Should be on profile page
    await expect(page).toHaveURL(/.*\/profiel/)
    
    // Check for profile sections
    await expect(page.locator('[data-testid="profile-header"]')).toBeVisible()
    await expect(page.locator('[data-testid="profile-tabs"]')).toBeVisible()
  })

  test('should use AI chatbot', async ({ page }) => {
    // Click on AI chatbot button
    await page.click('[data-testid="ai-chatbot-toggle"]')
    
    // Check if chatbot is visible
    await expect(page.locator('[data-testid="ai-chatbot"]')).toBeVisible()
    
    // Type a message
    await page.fill('[data-testid="chat-input"]', 'What is the best e-bike for city commuting?')
    await page.click('[data-testid="send-message"]')
    
    // Check if message was sent
    await expect(page.locator('[data-testid="user-message"]')).toBeVisible()
    
    // Wait for AI response
    await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 })
  })

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if mobile navigation is visible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Check if tablet layout is correct
    await expect(page.locator('[data-testid="ebike-grid"]')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Check if desktop layout is correct
    await expect(page.locator('[data-testid="desktop-navigation"]')).toBeVisible()
  })

  test('should handle page loading states', async ({ page }) => {
    // Navigate to a page that might have loading states
    await page.click('text=Alle E-Bikes')
    
    // Check for loading indicators
    const loadingIndicator = page.locator('[data-testid="loading-skeleton"]')
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible()
    }
    
    // Wait for content to load
    await expect(page.locator('[data-testid="ebike-list"]')).toBeVisible()
  })

  test('should handle error states', async ({ page }) => {
    // Navigate to a non-existent e-bike
    await page.goto('http://127.0.0.1:5173/ebike/nonexistent')
    
    // Check for error message
    await expect(page.locator('text=E-bike niet gevonden')).toBeVisible()
    
    // Check for back navigation
    await expect(page.locator('[data-testid="back-button"]')).toBeVisible()
  })
})
