"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import for routing
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { PasswordInput, checkPasswordStrength } from "@/components/ui/password";

export default function SignupPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("IN");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let passswordStrength = checkPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      nickname,
      username,
      email,
      phone,
      country,
      password,
    };

    try {
      const response = await fetch("http://65.1.1.229:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/auth/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to sign up. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4">
      <Image
        src="/assets/Logo.png"
        alt="Logo"
        width={100}
        height={100}
        className="mb-6 mt-10 h-24 w-24" // Adjust size as needed
      />
      <div className="w-full max-w-md p-6 rounded-md">
        <h1 className="text-4xl font-semibold text-center mb-2">
          Create an Account
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-12">
          Sign up to get started with our platform
        </p>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-4 ">
          <div className="grid gap-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="Prashant"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="prashant123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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

          <div className="grid grid-cols-4 gap-4">
            <div className="grid gap-2 col-span-1">
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                value={country}
                onValueChange={(value) => setCountry(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">IN</SelectItem>
                  <SelectItem value="CA">CA</SelectItem>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="GB">UK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 col-span-3">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="123-456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              passwordScore={passswordStrength}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline hover:text-primary">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
