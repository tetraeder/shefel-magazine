import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ContentProvider } from '../services/content/ContentProvider';
import { ManualProvider } from '../services/content/ManualProvider';

const defaultProvider = new ManualProvider();
const ContentCtx = createContext<ContentProvider>(defaultProvider);

export function ContentProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ContentCtx.Provider value={defaultProvider}>
      {children}
    </ContentCtx.Provider>
  );
}

export function useContentProvider() {
  return useContext(ContentCtx);
}
