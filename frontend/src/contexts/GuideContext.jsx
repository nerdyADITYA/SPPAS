import React, { createContext, useContext, useState } from 'react';

const GuideContext = createContext();

export const GuideProvider = ({ children }) => {
  const [guideMode, setGuideMode] = useState(() => {
    const saved = localStorage.getItem('sppas_guide_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleGuideMode = () => {
    setGuideMode((prev) => {
      const next = !prev;
      localStorage.setItem('sppas_guide_mode', JSON.stringify(next));
      return next;
    });
  };

  return (
    <GuideContext.Provider value={{ guideMode, toggleGuideMode, setGuideMode }}>
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = () => useContext(GuideContext);
