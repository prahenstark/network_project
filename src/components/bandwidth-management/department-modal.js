import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchDashboardInfo } from "@/lib/api";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import { Input } from "../ui/input";

export default function DepartmentModal({ toggleModal }) {
  const [departmentName, setDepartmentName] = useState(""); // Department Name
  const { selectedBandwidthDevice } = useBandwidthDevice();

  const handleSubmit = async () => {
    if (!departmentName) {
      toast({
        description: "Please input department name.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      Name: departmentName,
    };

    try {
      const response = await fetchDashboardInfo(
        `/devices/set-department/${selectedBandwidthDevice}?action=add`,
        "PUT",
        payload,
        false
      );
      console.log("API Payload:", payload);
      console.log("API Response:", response);
      toast({ description: "department added successfully!" });
      toggleModal(); // Close modal on success
    } catch (error) {
      console.error("Error adding department:", error);
      toast({
        description: "There was an error adding the department.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={toggleModal}
      />

      {/* Modal Content */}
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Add Department</h2>
          <Button onClick={toggleModal} variant="ghost" size="icon">
            <XIcon size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Source IP */}
          <div>
            {/* Name Field */}
            <div>
              <Label className="mb-2">Name</Label>
              <Input
                type="text"
                className="input w-full text-white p-2"
                placeholder="Enter Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 border-t">
          <Button onClick={toggleModal} variant="outline" className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="default">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
