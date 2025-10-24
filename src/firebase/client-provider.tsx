
'use client';

import { useMemo } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import type { FirebaseServices } from '.';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseServices: FirebaseServices = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider
      value={{
        app: firebaseServices.app,
        auth: firebaseServices.auth,
        db: firebaseServices.db,
      }}
    >
      {children}
    </FirebaseProvider>
  );
}
