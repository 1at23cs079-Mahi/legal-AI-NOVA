
'use client';

import {
  DocumentData,
  DocumentReference,
  FirestoreError,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useAuth, useFirestore } from './provider';
import { useUser } from './use-user';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';


export type UseDocOptions = {
  disabled?: boolean;
};

export function useDoc<T>(
  ref: DocumentReference<DocumentData> | null,
  options: UseDocOptions = {}
) {
  const { disabled = false } = options;
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError>();

  useEffect(() => {
    if (!ref || disabled) {
      setData(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        if (doc.exists()) {
          setData({ ...doc.data(), id: doc.id } as T);
        } else {
          setData(undefined);
        }
        setIsLoading(false);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);

        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref, disabled]);

  return { data, isLoading, error };
}
