import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon, LightbulbIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchDashboardInfo } from "@/lib/api";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import { Input } from "../ui/input";

export default function SourceIpModal({ toggleModal }) {
  const [destinationIPName, setDestinationIPName] = useState(""); // Destination IP Name
  const [sourceIPName, setSourceIPName] = useState(""); // Source IP
  const [remarks, setRemarks] = useState("");
  const [notes, setNotes] = useState(""); // Textarea input for IPs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedBandwidthDevice } = useBandwidthDevice();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const startIPs = Array.from(
      document.querySelectorAll('input[placeholder="Enter start IP"]')
    ).map((input) => input.value.trim());

    const endIPs = Array.from(
      document.querySelectorAll('input[placeholder="Enter end IP"]')
    ).map((input) => input.value.trim());

    const invalidPairs = startIPs.some(
      (startIP, index) =>
        (startIP && !endIPs[index]) || (!startIP && endIPs[index])
    );

    if (invalidPairs) {
      toast({
        description:
          "Each Start IP must have a corresponding End IP and vice versa.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const validPairs = startIPs
      .map((startIP, index) => ({
        StartIP: startIP,
        EndIP: endIPs[index],
      }))
      .filter((pair) => pair.StartIP && pair.EndIP);

    if (validPairs.length === 0) {
      toast({
        description:
          "Please provide at least one valid Start IP and End IP pair.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      Name: sourceIPName,
      AddressObjCount: validPairs.length,
      address_array: validPairs,
    };

    try {
      const response = await fetchDashboardInfo(
        `/devices/address-object/${selectedBandwidthDevice}?action=add`,
        "PUT",
        payload,
        false
      );
      console.log("API Response:", response);
      toast({
        description: "Source IPs added successfully!",
        variant: "default",
      });
      toggleModal();
    } catch (error) {
      console.error("Error submitting form 2:", error);
      toast({
        description: "Error adding Source IPs.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleModal}
        />

        {/* Modal Content */}
        <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto text-right">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold">Add Source IP</h2>
            <Button onClick={toggleModal} variant="ghost" size="icon">
              <XIcon size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 text-left">
            {/* Name Field */}
            <div>
              <Label className="mb-2">Name</Label>
              <Input
                type="text"
                className="input w-full text-white p-2"
                placeholder="Enter Name"
                value={sourceIPName}
                onChange={(e) => setSourceIPName(e.target.value)}
              />
            </div>

            {/* Start and End IP Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Start IP</Label>
                {Array.from({ length: 9 }).map((_, idx) => (
                  <Input
                    key={`start-ip-${idx}`}
                    type="text"
                    className="input w-full mb-1"
                    placeholder="Enter start IP"
                  />
                ))}
              </div>
              <div>
                <Label className="mb-2">End IP</Label>
                {Array.from({ length: 9 }).map((_, idx) => (
                  <Input
                    key={`end-ip-${idx}`}
                    type="text"
                    className="input w-full mb-1"
                    placeholder="Enter end IP"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center p-4 border-t">
            <Button onClick={toggleModal} variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
