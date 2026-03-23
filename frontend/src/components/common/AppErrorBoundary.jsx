import React from 'react';
import { AlertTriangle } from 'lucide-react';

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Unhandled UI error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            const isChunkError = this.state.error &&
                (this.state.error.name === 'ChunkLoadError' ||
                    this.state.error.message?.includes('Failed to fetch dynamically imported module') ||
                    this.state.error.message?.includes('error loading dynamically imported module'));

            return (
                <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6">
                    <div className="w-full max-w-xl bg-slate-100 border border-slate-200 rounded-3xl p-8 text-center">
                        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                            <AlertTriangle className={isChunkError ? "text-indigo-300" : "text-red-300"} size={28} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">
                            {isChunkError ? "New Version Available" : "Something Went Wrong"}
                        </h1>
                        <p className="text-gray-300 text-sm mb-4">
                            {isChunkError
                                ? "We've updated MentriQ with new features. Click below to update your session."
                                : "The page crashed unexpectedly. Reload to continue."}
                        </p>
                        {this.state.error && !isChunkError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left overflow-auto max-h-32">
                                <p className="text-red-300 text-[10px] font-mono leading-tight">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={this.handleReload}
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs tracking-widest uppercase"
                        >
                            {isChunkError ? "Update Now" : "Reload Page"}
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
