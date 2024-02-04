'use client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Home(): React.JSX.Element {
  const router: AppRouterInstance = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    router.push(token ? '/home' : '/login');
  }, []);

  return <div></div>;
}
