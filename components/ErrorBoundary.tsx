import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component to catch and handle React errors gracefully
 * Prevents the entire application from crashing due to component errors
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Here you could send error reports to a logging service
    // logErrorToService(error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <h3 className="text-red-800 font-semibold">Something went wrong</h3>
            </div>
            <p className="text-red-700 mb-4">
              An unexpected error occurred. Please refresh the page and try again.
            </p>
            {this.state.error && (
              <details className="text-sm text-red-600">
                <summary className="cursor-pointer font-medium">Error details</summary>
                <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
