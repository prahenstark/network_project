import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XIcon, LightbulbIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchDashboardInfo } from "@/lib/api";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

function getMaskFromCIDR(cidr) {
  // Extract the prefix length from CIDR (e.g., 15 from /15)
  const prefixLength = parseInt(cidr.split("/")[1], 10);

  // Generate the subnet mask based on the prefix length
  let maskBinary = "1".repeat(prefixLength) + "0".repeat(32 - prefixLength); // Create binary mask
  let maskArray = maskBinary.match(/.{8}/g); // Split into octets (8 bits each)

  // Convert the binary octets to decimal
  const subnetMask = maskArray.map((bin) => parseInt(bin, 2)).join(".");

  // Return the subnet mask
  return subnetMask;
}

function getNetworkAndMask(inputCIDR) {
  const prefixLength = inputCIDR.split("/")[1];
  const Net = inputCIDR.split("/")[0]; // The network address (e.g., 1.25.0.0)
  const Mask = getMaskFromCIDR(inputCIDR); // Get the subnet mask based on CIDR

  // Return the result in the requested object format
  return {
    Net: Net,
    Mask: Mask,
  };
}

export default function DestinationIpModal({ toggleModal }) {
  const [destinationIPName, setDestinationIPName] = useState(""); // Destination IP Name
  const [remarks, setRemarks] = useState("");
  const [notes, setNotes] = useState(""); // Textarea input for IPs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedBandwidthDevice } = useBandwidthDevice();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const ipLines = notes
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line); // Split and filter out empty lines

    const routeTable = ipLines.map((ip) => getNetworkAndMask(ip)); // Generate route table

    const payload = {
      Name: destinationIPName,
      ZH_Desc: remarks,
      EN_Desc: remarks,
      RouteCount: routeTable.length,
      RouteTable: routeTable,
    };

    console.log("Payload:", payload);

    try {
      const response = await fetchDashboardInfo(
        `/devices/set-destination-ip/${selectedBandwidthDevice}?action=add`,
        "PUT",
        payload,
        false
      );
      console.log("API Payload:", payload);
      console.log("API Response:", response);

      if (response.status !== 200) {
        toast({
          description: "There was an error adding the destination ip.",
          variant: "destructive",
        });
        return;
      }

      toast({ description: "Destination IP added successfully!" });
      toggleModal(); // Close modal on success
    } catch (error) {
      console.error("Error adding Destination IP:", error);
      toast({
        description: "There was an error adding the destination ip.",
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
        <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md text-right">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold">Add Destination IP</h2>
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
                value={destinationIPName}
                onChange={(e) => setDestinationIPName(e.target.value)}
              />
            </div>

            {/* Remarks Field */}
            <div>
              <Label className="mb-2">Remarks</Label>
              <Input
                type="text"
                className="input w-full text-white p-2"
                placeholder="Enter remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Tips */}
            <div className="flex items-start space-x-2 text-white py-2">
              <LightbulbIcon className="mt-1 " size={20} />
              <p className="text-sm ">
                The destination address format is IP/mask bits, for e.g{" "}
                <b className="text-green-500">1.25.0.0/15</b>
              </p>
            </div>

            {/* Additional Notes (Textarea) */}
            <div>
              <textarea
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-white text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                )}
                style={{
                  height: "100px", // Set a specific height
                  resize: "none", // Disable resizing
                  overflowY: "auto", // Enable vertical scrolling
                }}
                rows={4}
                placeholder="Enter destination address..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
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
