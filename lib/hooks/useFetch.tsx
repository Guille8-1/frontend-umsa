"use client";
import { useCallback, useEffect, useState } from 'react';


export function useData<T>(secret: string, token: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    const actualUrl: string = `${secret}/projects/numbers`
    try {
      setLoading(true);
      setError(null);
      const request = await fetch(actualUrl, {
        headers: {
          Athorization: `Bearer ${token}`
        },
        signal: controller.signal
      });
      setData(await request.json());

    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        setError(error as Error)
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort()
  }, [secret]);

  useEffect(() => {
    fetchData()
  }, []);

  return { data, loading, error, refetch: fetchData };
}

