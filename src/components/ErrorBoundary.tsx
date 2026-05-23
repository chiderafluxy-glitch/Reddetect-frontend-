import React from 'react';

class ErrorBoundary extends React.Component<{fallback: React.ReactNode, children: React.ReactNode}, {hasError: boolean, error: any}> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      console.error('Dashboard crash:', this.state.error);
      return this.props.fallback;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;