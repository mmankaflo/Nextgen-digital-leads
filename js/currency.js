const currency = (() => {
  // Fixed prices in South African Rand
  const prices = {
    starter: 'R2,500',
    professional: 'R5,000'
  };

  // Initialize currency - no location detection
  const init = () => {
    // Prices are hardcoded, nothing to do on init
    console.log('Pricing loaded: Starter R2,500, Professional R5,000');
  };

  // Public method to get current currency info
  const getCurrencyInfo = () => {
    return {
      code: 'ZAR',
      symbol: 'R',
      country: 'ZA'
    };
  };

  return {
    init,
    getCurrencyInfo,
    prices
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    currency.init();
  });
} else {
  currency.init();
}
