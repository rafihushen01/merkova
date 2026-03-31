import { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.jsx";
import { store } from "./pages/redux/Store.js";

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Frontend root crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
          <section className="max-w-lg text-center border border-gray-200 rounded-xl p-6 shadow-sm">
            <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
            <p className="text-sm text-gray-700">
              The application hit an unexpected error. Refresh the page, and if
              the problem continues, check browser console logs.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <RootErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </RootErrorBoundary>
  </StrictMode>
);
