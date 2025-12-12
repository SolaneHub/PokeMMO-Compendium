import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () =>
          this.setState({ hasError: false })
        );
      }
      return (
        <div className="rounded-xl border border-red-500/50 bg-red-900/20 p-6 text-center text-red-200">
          <h3 className="mb-2 text-lg font-bold">Something went wrong</h3>
          <p className="text-sm opacity-80">
            {this.state.error?.message || "Unknown error"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
