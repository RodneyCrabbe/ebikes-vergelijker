import { useCookieConsentStore } from '../stores/cookieConsent'

// Blocked scripts registry
const blockedScripts: Array<{
  id: string
  src: string
  type: 'analytics' | 'marketing' | 'support'
  loaded: boolean
}> = []

// Script loading functions
export function loadAnalyticsScripts() {
  const cookieStore = useCookieConsentStore()
  if (!cookieStore.isConsentGiven('analytics')) return

  // Load Google Analytics
  if (!document.querySelector('script[src*="google-analytics"]')) {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'
    script.id = 'google-analytics'
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', 'GA_MEASUREMENT_ID', {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    })
  }
}

export function loadMarketingScripts() {
  const cookieStore = useCookieConsentStore()
  if (!cookieStore.isConsentGiven('marketing')) return

  // Load Google Ads
  if (!document.querySelector('script[src*="googletagmanager"]')) {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID'
    script.id = 'google-ads'
    document.head.appendChild(script)
  }

  // Load Meta Pixel
  if (!document.querySelector('script[src*="connect.facebook.net"]')) {
    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'PIXEL_ID');
      fbq('track', 'PageView');
    `
    script.id = 'meta-pixel'
    document.head.appendChild(script)
  }
}

export function loadSupportScripts() {
  const cookieStore = useCookieConsentStore()
  if (!cookieStore.isConsentGiven('support')) return

  // Load Intercom
  if (!document.querySelector('script[src*="intercom"]')) {
    const script = document.createElement('script')
    script.innerHTML = `
      (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/APP_ID';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
    `
    script.id = 'intercom'
    document.head.appendChild(script)
  }
}

// Block script loading until consent
export function blockScriptUntilConsent(
  scriptId: string,
  scriptSrc: string,
  category: 'analytics' | 'marketing' | 'support'
) {
  blockedScripts.push({
    id: scriptId,
    src: scriptSrc,
    type: category,
    loaded: false
  })
}

// Load all consented scripts
export function loadConsentedScripts() {
  const cookieStore = useCookieConsentStore()
  
  if (cookieStore.isConsentGiven('analytics')) {
    loadAnalyticsScripts()
  }
  
  if (cookieStore.isConsentGiven('marketing')) {
    loadMarketingScripts()
  }
  
  if (cookieStore.isConsentGiven('support')) {
    loadSupportScripts()
  }
}

// Remove blocked scripts
export function removeBlockedScripts() {
  blockedScripts.forEach(script => {
    if (!script.loaded) {
      const element = document.getElementById(script.id)
      if (element) {
        element.remove()
      }
    }
  })
}
