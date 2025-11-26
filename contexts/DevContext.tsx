import React, { createContext, useContext, useState, ReactNode } from 'react';

// Development settings interface
export interface DevSettings {
  showTestSwipe: boolean;
  showTestButton: boolean;
  showDebugInfo: boolean;
  showGridOverlay: boolean;
  showOverlayDebug: boolean;
}

interface DevContextType {
  settings: DevSettings;
  updateSetting: (key: keyof DevSettings, value: boolean) => void;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

export function DevProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DevSettings>({
    showTestSwipe: false,
    showTestButton: false,
    showDebugInfo: false,
    showGridOverlay: true, // Grid is a core feature, default on
    showOverlayDebug: false,
  });

  const updateSetting = (key: keyof DevSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DevContext.Provider value={{ settings, updateSetting }}>
      {children}
    </DevContext.Provider>
  );
}

export function useDevSettings() {
  const context = useContext(DevContext);
  if (!context) {
    throw new Error('useDevSettings must be used within DevProvider');
  }
  return context;
}
