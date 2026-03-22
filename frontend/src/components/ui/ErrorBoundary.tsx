'use client';

import { Component, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        className="glass-card p-8 text-center space-y-3"
      >
        <div className="text-3xl">⚠️</div>
        <p className="text-sm font-medium text-text-primary">Something went wrong</p>
        <p className="text-xs text-text-secondary">{this.state.error?.message}</p>
        <Button size="sm" variant="secondary" onClick={this.reset}>
          Try Again
        </Button>
      </div>
    );
  }
}
