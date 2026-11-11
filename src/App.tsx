import React from 'react';
import { AppStoreProvider } from './store/useAppStore';
import { AppShell } from './components/layout/AppShell';

export function App() {
  return (
    <AppStoreProvider>
      <AppShell />
    </AppStoreProvider>
  );
}

export default App;

