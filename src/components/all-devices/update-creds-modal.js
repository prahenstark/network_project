"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { fetchProtectedInfo } from "@/lib/api";

const UpdateCredsModal = ({ device, isOpen, onClose }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;
  const handleUpdate = async () => {
    if (!username || !password) {
      toast({
        title: "Validation Error",
        variant: "destructive",
        description: "Both username and password are required.",
      });
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetchProtectedInfo(
        `/devices/update-credentials/${device.deviceId}`, // Path to API
        "POST", // HTTP method
        { username, password } // Data payload
      );
  
      toast({
        title: "Success",
        description: `Credentials updated for device ${device.deviceId}.`,
      });


      if (response) {
        toast({
          title: "Success",
          description: `Credentials updated for device ${device.deviceId}.`,
        });
        onClose();
      } else {
        toast({
          title: "Success",
          description: `Credentials updated for device ${device.deviceId}.`,
        });
      }
    } catch (error) {
      console.error("Error updating credentials:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
      onClose();

    }
  };
  

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-background w-[80%] max-w-lg p-6 rounded-lg relative shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Credentials</h2>
          <button onClick={onClose} className="hover:text-green-400">
            <XIcon />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Username"
            className="border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCredsModal;
