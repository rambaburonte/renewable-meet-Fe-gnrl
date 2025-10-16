import React, { createContext, useState, useMemo, ReactNode } from 'react';

export type Website = 'optics' | 'renewable' | 'nursing' | 'polymers' | 'aqua';

interface WebsiteContextType {
  website: Website;
  setWebsite: (website: Website) => void;
}

export const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

interface WebsiteProviderProps {
  children: ReactNode;
}

export const WebsiteProvider: React.FC<WebsiteProviderProps> = ({ children }) => {
  const [website, setWebsite] = useState<Website>(() => {
    const stored = localStorage.getItem('adminWebsite');
    return (stored as Website) || 'optics';
  });

  // Persist website selection
  const handleSetWebsite = (w: Website) => {
    setWebsite(w);
    localStorage.setItem('adminWebsite', w);
  };

  const value = useMemo(() => ({ website, setWebsite: handleSetWebsite }), [website]);

  return (
    <WebsiteContext.Provider value={value}>
      {children}
    </WebsiteContext.Provider>
  );
};
