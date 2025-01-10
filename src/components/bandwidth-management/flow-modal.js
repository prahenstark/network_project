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
import { XIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchDashboardInfo } from "@/lib/api";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";

export default function FlowModal({ toggleModal }) {
  const [addressOptions, setAddressOptions] = useState([]); // Source IP options
  const [destinationOptions, setDestinationOptions] = useState([]); // Destination IP options
  const [selectedSourceIP, setSelectedSourceIP] = useState(""); // Selected Source IP
  const [selectedDestinationIP, setSelectedDestinationIP] = useState(""); // Selected Destination IP
  const [sourceType, setSourceType] = useState("address"); // Destination Port type (static for now)
  const { selectedBandwidthDevice } = useBandwidthDevice();

  // Fetch Source IP and Destination IP data from APIs
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch Source IP options
        const sourceResponse = await fetchDashboardInfo(
          `/devices/address-object/${selectedBandwidthDevice}`,
          "GET",
          null,
          false
        );
        console.log("Source", sourceResponse);
        setAddressOptions(sourceResponse?.response?.addressobj_array || []);

        // Fetch Destination IP options
        const destinationResponse = await fetchDashboardInfo(
          `/devices/get-destination-ip/${selectedBandwidthDevice}`,
          "GET",
          null,
          false
        );
        setDestinationOptions(destinationResponse?.response?.isp_array || []);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast({
          description: "Error loading IP options.",
          variant: "destructive",
        });
      }
    };

    fetchOptions();
  }, [selectedBandwidthDevice]);

  const handleSubmit = async () => {
    if (!selectedSourceIP || !selectedDestinationIP) {
      toast({
        description: "Please select both Source IP and Destination IP.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      Enabled: 1,
      SrcAddrType: 1,
      SrcAddress: selectedSourceIP,
      DestinationIP: selectedDestinationIP,
      Schedule: "ANY",
    };

    try {
      const response = await fetchDashboardInfo(
        "/devices/bandwidth-rules/add",
        "POST",
        payload
      );
      console.log("API Payload:", payload);
      console.log("API Response:", response);
      toast({ description: "Bandwidth rule added successfully!" });
      toggleModal(); // Close modal on success
    } catch (error) {
      console.error("Error adding bandwidth rule:", error);
      toast({
        description: "There was an error adding the bandwidth rule.",
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
          <h2 className="text-lg font-bold">Bandwidth Control Rule</h2>
          <Button onClick={toggleModal} variant="ghost" size="icon">
            <XIcon size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Source IP */}
          <div>
            <Label className="mb-2">Source IP</Label>
            <Select onValueChange={setSelectedSourceIP}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Source IP" />
              </SelectTrigger>
              <SelectContent>
                {addressOptions.map((ip) => (
                  <SelectItem key={ip} value={ip.Name}>
                    {ip.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination IP */}
          <div>
            <Label className="mb-2">Destination IP</Label>
            <Select onValueChange={setSelectedDestinationIP}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Destination IP" />
              </SelectTrigger>
              <SelectContent>
                {destinationOptions.map((ip) => (
                  <SelectItem key={ip} value={ip.Name}>
                    {ip.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination Port */}
          <div>
            <Label className="mb-2">Destination Port</Label>
            <Select
              value={sourceType}
              onValueChange={(value) => setSourceType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Destination Port" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="address">ANY</SelectItem>
              </SelectContent>
            </Select>
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
