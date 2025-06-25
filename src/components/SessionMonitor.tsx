import React, { useState, useEffect } from 'react';
import { useEnterpriseSession } from '../Context/EnterpriseSessionContext';

interface SessionMonitorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showInProduction?: boolean;
  compact?: boolean;
}

export const SessionMonitor: React.FC<SessionMonitorProps> = ({ 
  position = 'bottom-right',
  showInProduction = false,
  compact = false
}) => {
  const { sessionInfo, sessionHealth, isAuthenticated, refreshSession } = useEnterpriseSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // Only show in development unless explicitly enabled for production
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;

  useEffect(() => {
    // For production, only show if there are session issues
    if (process.env.NODE_ENV === 'production') {
      setIsVisible(shouldShow && isAuthenticated && sessionHealth !== 'healthy');
    } else {
      setIsVisible(shouldShow && isAuthenticated);
    }
  }, [shouldShow, isAuthenticated, sessionHealth]);

  if (!isVisible || !sessionInfo) {
    return null;
  }

  const getPositionClasses = () => {
    const base = 'fixed z-50 ';
    switch (position) {
      case 'top-left':
        return base + 'top-4 left-4';
      case 'top-right':
        return base + 'top-4 right-4';
      case 'bottom-left':
        return base + 'bottom-4 left-4';
      case 'bottom-right':
        return base + 'bottom-4 right-4';
      default:
        return base + 'bottom-4 right-4';
    }
  };

  const getHealthColor = () => {
    switch (sessionHealth) {
      case 'healthy':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'refreshing':
        return 'bg-blue-600';
      case 'expired':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getHealthText = () => {
    switch (sessionHealth) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Expiring Soon';
      case 'refreshing':
        return 'Refreshing...';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 0) return 'Expired';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const handleRefresh = async () => {
    try {
      await refreshSession();
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  };

  if (compact) {
    return (
      <div className={getPositionClasses()}>
        <div 
          className={`${getHealthColor()} text-white px-2 py-1 rounded-full text-xs cursor-pointer`}
          onClick={() => setIsExpanded(!isExpanded)}
          title={`Session: ${getHealthText()}`}
        >
          {sessionHealth === 'refreshing' ? '⟳' : '●'}
        </div>
        
        {isExpanded && (
          <div className="absolute bottom-8 right-0 bg-black border border-gray-600 rounded-lg p-3 text-xs text-white min-w-48">
            <div className="font-semibold mb-2">Session Status</div>
            <div>Status: <span className="text-yellow-400">{getHealthText()}</span></div>
            <div>Expires: <span className="text-blue-400">{formatTime(sessionInfo.timeUntilExpiry)}</span></div>
            <div>User: <span className="text-green-400">{sessionInfo.user.email}</span></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={getPositionClasses()}>
      <div className="bg-black bg-opacity-90 border border-gray-600 rounded-lg p-4 text-white text-sm max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-yellow-400">Session Monitor</div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getHealthColor()}`}></div>
              <span className="text-yellow-400">{getHealthText()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Session ID:</span>
            <span className="text-blue-400 font-mono text-xs">
              {sessionInfo.sessionId.split('_')[2]}...
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>User:</span>
            <span className="text-green-400">{sessionInfo.user.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Expires in:</span>
            <span className={`${sessionInfo.timeUntilExpiry < 300 ? 'text-red-400' : 'text-blue-400'}`}>
              {formatTime(sessionInfo.timeUntilExpiry)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Last activity:</span>
            <span className="text-gray-400">
              {formatTime(sessionInfo.timeSinceActivity)} ago
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Issued at:</span>
            <span className="text-gray-400 text-xs">
              {sessionInfo.issuedAt.toLocaleTimeString()}
            </span>
          </div>

          {sessionHealth === 'warning' && (
            <div className="mt-3 p-2 bg-yellow-900 border border-yellow-600 rounded text-xs">
              <div className="flex items-center justify-between">
                <span>⚠️ Session expiring soon</span>
                <button
                  onClick={handleRefresh}
                  className="ml-2 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs"
                  disabled={sessionHealth === 'refreshing'}
                >
                  {sessionHealth === 'refreshing' ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          )}

          {sessionHealth === 'refreshing' && (
            <div className="mt-3 p-2 bg-blue-900 border border-blue-600 rounded text-xs">
              🔄 Refreshing session token...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionMonitor;
