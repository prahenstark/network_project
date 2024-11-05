"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const signIn = async (e) => {
    e.preventDefault();
    setError(null); // Clear any existing errors

    try {
      const response = await axios.post('http://13.233.36.198:5000/api/auth/login', {
        email,
        password,
      });

      // Handle response
      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('bearerToken', response.data.token);
        // Redirect to home
        router.push('/');
        // Optionally, update context if needed
        // Example: setUser({ role: response.data.role });
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      console.log('Error during sign-in:', err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4">
      <img
        src="/assets/Logo.png"
        alt="Logo"
        className="mb-6 h-24 w-24" // Adjust size as needed
      />
      <div className="w-full max-w-md p-6 rounded-md">
        <h1 className="text-4xl font-semibold text-center mb-2">Login to Continue</h1>
        <p className="text-center text-muted-foreground text-sm mb-12">
          Enter your email below to login to your account
        </p>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={signIn} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline hover:text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
