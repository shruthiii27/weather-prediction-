
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-6 border border-red-500/20 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Oops! Something went wrong</h3>
      <p className="text-white/80 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
