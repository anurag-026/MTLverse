import React, { createContext, useContext, useEffect, useState } from 'react';

const defaultPreferences = {
  languages: ['all'],
  contentFilters: {
    hideAdult: false,
    blurAdult: true,
    showRatings: true,
    ageRatings: { 'all-ages': true, teen: true, '18+': true, '18++': true },
  },
  reading: { autoplay: false, soundEffects: true, notifications: true, autoBookmark: true },
  display: { showCoverArt: true, compactView: false, showProgress: true },
};

const PreferencesContext = createContext(undefined);

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch {}
    }
  }, []);

  const updatePreferences = (partial) => {
    const updated = { ...preferences, ...partial };
    setPreferences(updated);
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider');
  return ctx;
}


