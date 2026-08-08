import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import logo from "@/assets/indo-logo.jpg";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full">
                        <div className="mb-8 flex justify-center">
                            <img src={logo} alt="Indo American School" className="w-24 h-auto" />
                        </div>

                        <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-destructive" size={40} />
                        </div>

                        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Something went wrong</h1>
                        <p className="text-muted-foreground mb-8">
                            We apologize for the inconvenience. An unexpected error has occurred while rendering this page.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={this.handleReset} className="flex items-center gap-2">
                                <RotateCcw size={18} />
                                Try Again
                            </Button>
                            <Button asChild variant="outline" className="flex items-center gap-2">
                                <a href="/">
                                    <Home size={18} />
                                    Back to Home
                                </a>
                            </Button>
                        </div>

                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <div className="mt-12 p-4 bg-muted rounded-lg text-left overflow-auto max-h-40">
                                <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;


