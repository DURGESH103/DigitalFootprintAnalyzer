'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOnline(false);
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(!isOnline || showRestored) && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          role="status"
          aria-live="polite"
          className={`fixed top-14 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 text-xs font-medium ${
            isOnline
              ? 'bg-accent-green/10 text-accent-green border-b border-accent-green/20'
              : 'bg-accent-orange/10 text-accent-orange border-b border-accent-orange/20'
          }`}
        >
          {isOnline ? (
            <><Wifi className="h-3.5 w-3.5" /> Connection restored</>
          ) : (
            <><WifiOff className="h-3.5 w-3.5" /> You&apos;re offline — some features may be unavailable</>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
