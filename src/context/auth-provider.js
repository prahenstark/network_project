"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("bearerToken");

      if (!token) {
        redirectToLogin();
        return;
      }

      try {
        const response = await fetch("http://13.232.192.143:5000/middleware", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          if (!pathname.includes("/auth")) {
            router.push("/auth/login");
          }
        } else if (response.status === 200) {
          const data = await response.json();
          setUser(data?.user);
        }
      } catch (error) {
        console.log("Error checking authentication:", error);
      } finally {
        setLoading(false); // Set loading to false when checkAuth is complete
      }
    };

    checkAuth();
  }, [router, pathname]);

  const redirectToLogin = () => {
    if (!pathname.includes("/auth")) {
      router.push("/auth/login");
    }
    setLoading(false); // Ensure loading stops after redirection
  };

  // Check if the user is not an admin and trying to access the account page
  useEffect(() => {
    if (user && user.role !== "vendor" && pathname === "/accounts") {
      router.push("/"); // Redirect to home or an unauthorized page
    }
  }, [user, pathname, router]);

  // Render a loading state until we confirm the user's authentication status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {!pathname.includes("/auth") && !user ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
