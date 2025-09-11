import { useCallback, useEffect, useState } from 'react';
// import Shepherd from 'shepherd.js';
// import 'shepherd.js/dist/css/shepherd.css';

export function useTour() {
  const [tour, setTour] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);

  // Temporarily disabled Shepherd.js to fix white page issue
  // Will re-enable once the homepage is working
  return { startTour: () => {}, stopTour: () => {}, isActive: false };
}