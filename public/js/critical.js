/**
 * Critical JavaScript for E-Bike Platform
 * This file contains essential functionality that needs to load immediately
 */

// Critical error handling
window.addEventListener('error', function(e) {
  console.error('Critical error:', e.error);
});

// Critical performance monitoring
window.addEventListener('load', function() {
  // Mark critical resources as loaded
  if (window.performance && window.performance.mark) {
    window.performance.mark('critical-js-loaded');
  }
});

// Critical navigation helpers
window.criticalNavigation = {
  // Check if we're on a valid route
  isValidRoute: function(path) {
    const validRoutes = [
      '/',
      '/e-bikes',
      '/e-bikes/',
      '/reviews',
      '/community',
      '/over-ons',
      '/contact',
      '/login',
      '/registreer',
      '/afspraak',
      '/profiel',
      '/notifications',
      '/nieuwsbrief',
      '/cookiebeleid'
    ];
    
    return validRoutes.some(route => path === route || path.startsWith(route + '/'));
  },
  
  // Handle navigation errors
  handleNavigationError: function(error) {
    console.error('Navigation error:', error);
    // Don't redirect to homepage for navigation errors
    return false;
  }
};

// Critical CSS loading
window.addEventListener('DOMContentLoaded', function() {
  // Ensure critical styles are applied
  const criticalStyles = `
    #app { min-height: 100vh; }
    .loading { opacity: 0.5; }
    .error { color: #dc2626; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalStyles;
  document.head.appendChild(style);
});

console.log('Critical JavaScript loaded successfully');
