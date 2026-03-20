import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { applyThemePalette, getStoredThemePalette } from './lib/theme-preferences';

export default function App() {
  useEffect(() => {
    applyThemePalette(getStoredThemePalette().id);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
