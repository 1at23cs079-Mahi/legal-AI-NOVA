
'use client';

import {
  onSnapshot,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  endBefore,
  limitToLast,
  startAt,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useAuth, useFirestore } from './provider';
import { useUser } from './use-user';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

export type UseCollectionOptions = {
  disabled?: boolean;
};

export function useCollection<T>(
  query: Query<DocumentData> | null,
  options: UseCollectionOptions = {}
) {
  const { disabled } = options;
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError>();

  useEffect(() => {
    if (!query || disabled) {
      setData(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot) => {
        const data: any[] = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setData(data as T[]);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
            path: query.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);

        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, disabled]);

  return { data, isLoading, error };
}
