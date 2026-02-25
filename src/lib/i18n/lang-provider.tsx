'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { content, type Lang } from '@/lib/utils/i18n';

type ContentForLang = (typeof content)[Lang];

interface LangContextValue {
  lang: Lang;
  t: ContentForLang;
  toggleLang: (lang: Lang) => void;
}

const LANG_STORAGE_KEY = 'cosmed-lang';

function getInitialLang(): Lang {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'en' || stored === 'ko') return stored;
  }
  return 'en';
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLang(getInitialLang());
    setHydrated(true);
  }, []);

  const toggleLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
  }, []);

  const t = content[lang];

  if (!hydrated) {
    return (
      <LangContext.Provider value={{ lang: 'en', t: content['en'], toggleLang }}>
        {children}
      </LangContext.Provider>
    );
  }

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
