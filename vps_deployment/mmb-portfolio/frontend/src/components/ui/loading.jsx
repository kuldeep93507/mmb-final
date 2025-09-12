import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

// Basic spinner component
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  );
};

// Loading overlay for buttons
export const ButtonLoading = ({ children, loading = false, ...props }) => {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </Button>
  );
};

// Full page loading component
export const PageLoading = ({ 
  message = 'Loading...', 
  size = 'lg',
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="text-center">
        <Spinner size={size} className="mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

// Card loading skeleton
export const CardLoading = ({ className = '' }) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Table loading skeleton
export const TableLoading = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex space-x-4 mb-4 pb-2 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-3 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className={`h-3 bg-gray-200 rounded flex-1 ${
                colIndex === 0 ? 'w-1/4' : 
                colIndex === columns - 1 ? 'w-1/6' : 'w-1/3'
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Stats card loading
export const StatsLoading = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Error state component
export const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading the data.',
  onRetry = null,
  retryText = 'Try Again',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[300px] ${className}`}>
      <div className="text-center max-w-md">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
};

// Empty state component
export const EmptyState = ({ 
  title = 'No data found',
  message = 'There is no data to display at the moment.',
  action = null,
  icon: Icon = null,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[300px] ${className}`}>
      <div className="text-center max-w-md">
        {Icon && <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {action}
      </div>
    </div>
  );
};

// Loading wrapper component
export const LoadingWrapper = ({ 
  loading = false,
  error = null,
  empty = false,
  onRetry = null,
  loadingComponent = null,
  errorComponent = null,
  emptyComponent = null,
  children
}) => {
  if (loading) {
    return loadingComponent || <PageLoading />;
  }

  if (error) {
    return errorComponent || (
      <ErrorState 
        title="Failed to load data"
        message={error.message || 'An error occurred while loading the data.'}
        onRetry={onRetry}
      />
    );
  }

  if (empty) {
    return emptyComponent || (
      <EmptyState 
        title="No data available"
        message="There is no data to display at the moment."
      />
    );
  }

  return children;
};

// Progress loading component
export const ProgressLoading = ({ 
  progress = 0, 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="text-center w-full max-w-md">
        <Spinner size="lg" className="mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600 text-lg mb-4">{message}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

// Inline loading component for small spaces
export const InlineLoading = ({ 
  message = 'Loading...', 
  size = 'sm',
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Spinner size={size} className="text-blue-600" />
      <span className="text-gray-600 text-sm">{message}</span>
    </div>
  );
};

export default {
  Spinner,
  ButtonLoading,
  PageLoading,
  CardLoading,
  TableLoading,
  StatsLoading,
  ErrorState,
  EmptyState,
  LoadingWrapper,
  ProgressLoading,
  InlineLoading
};