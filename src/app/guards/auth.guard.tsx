'use client';
import { redirect } from 'next/navigation';
import React, { useEffect, useLayoutEffect, useState } from 'react';

export function authenticate<T>(Component: () => React.JSX.Element) {
  return (props?: T) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) redirect('/login');
      setToken(token);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/service-worker.js', { type: 'classic' })
          .then(registration => console.log('scope is: ', registration.scope));
      }
    }, []);

    return <Component {...props} />;
  };
}
