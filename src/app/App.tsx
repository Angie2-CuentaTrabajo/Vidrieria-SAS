import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { applyThemePreferences, getStoredThemePreferences } from './lib/theme-preferences';

export default function App() {
  useEffect(() => {
    applyThemePreferences(getStoredThemePreferences());
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
