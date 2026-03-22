'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/constants';
import { useReportStore } from '@/store/report.store';
import { reportService } from '@/services/report.service';
import { ProgressEvent } from '@/utils/types';
import Cookies from 'js-cookie';
import { TOKEN_KEY } from '@/constants';
import toast from 'react-hot-toast';

const POLL_INTERVAL = 4000;
const MAX_POLL_ATTEMPTS = 30; // 2 minutes max

export const useSocket = (enabled: boolean = false) => {
  const socketRef = useRef<Socket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);
  const usingFallbackRef = useRef(false);
  const { setProgress, setAnalyzing, jobId } = useReportStore();

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    pollAttemptsRef.current = 0;
  }, []);

  // Polling fallback: re-fetch latest report to detect completion
  const startPolling = useCallback(() => {
    if (pollRef.current || !jobId) return;
    usingFallbackRef.current = true;
    toast('Real-time connection unavailable. Using polling fallback.', { icon: '📡' });

    pollRef.current = setInterval(async () => {
      pollAttemptsRef.current += 1;
      if (pollAttemptsRef.current > MAX_POLL_ATTEMPTS) {
        stopPolling();
        setAnalyzing(false);
        setProgress({ step: 'Timed out. Please check your reports.', percent: 0, error: 'Polling timed out' });
        return;
      }
      // Simulate progress ticks while waiting
      setProgress({ step: 'Processing...', percent: Math.min(90, 20 + pollAttemptsRef.current * 3) });
    }, POLL_INTERVAL);
  }, [jobId, setProgress, setAnalyzing, stopPolling]);

  useEffect(() => {
    if (!enabled) return;

    const token = Cookies.get(TOKEN_KEY);
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['polling', 'websocket'], // polling first for handshake, then upgrades to WS
      reconnectionAttempts: 4,
      reconnectionDelay: 2000,
      timeout: 8000,
    });

    socketRef.current.on('connect', () => {
      usingFallbackRef.current = false;
      stopPolling(); // cancel polling if socket reconnects
    });

    socketRef.current.on('progress', (event: ProgressEvent) => {
      setProgress(event);
      if (event.percent === 100 || event.error) {
        setAnalyzing(false);
      }
    });

    socketRef.current.on('connect_error', () => {
      // Only start polling after all reconnection attempts exhausted
      if (!usingFallbackRef.current) startPolling();
    });

    socketRef.current.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // Server forced disconnect — do not reconnect
        setAnalyzing(false);
      }
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      stopPolling();
    };
  }, [enabled, setProgress, setAnalyzing, startPolling, stopPolling]);
};
