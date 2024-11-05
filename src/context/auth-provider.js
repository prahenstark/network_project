"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('bearerToken');
      
      if (!token) {
        redirectToLogin();
        return;
      }

      try {
        const response = await fetch('http://13.233.36.198:5000/middleware', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          if (!pathname.includes('/auth')) {
            router.push('/auth/login');
          }
        } else if (response.status === 200) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.log('Error checking authentication:', error);
      } finally {
        setLoading(false); // Set loading to false when checkAuth is complete
      }
    };

    checkAuth();
  }, [router, pathname]);

  const redirectToLogin = () => {
    if (!pathname.includes('/auth')) {
      router.push('/auth/login');
    }
    setLoading(false); // Ensure loading stops after redirection
  };

  // Check if the user is not an admin and trying to access the account page
  useEffect(() => {
    if (user && user.role !== 'admin' && pathname === '/accounts') {
      router.push('/'); // Redirect to home or an unauthorized page
    }
  }, [user, pathname, router]);

  // Render a loading state until we confirm the user's authentication status
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
