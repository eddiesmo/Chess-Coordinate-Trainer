export const useGoogleAnalytics = () => {
  const sendEvent = (eventName, eventParams = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, eventParams);
    }
  };

  return { sendEvent };
}; 