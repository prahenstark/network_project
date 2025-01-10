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

export default function IpModal({ toggleModal }) {
  const [activeTab, setActiveTab] = useState("form1"); // State to track the active tab
  const [addressOptions, setAddressOptions] = useState([]); // Source IP options
  const [destinationOptions, setDestinationOptions] = useState([]); // Destination IP options
  const { selectedBandwidthDevice } = useBandwidthDevice();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const sourceResponse = await fetchDashboardInfo(
          `/devices/address-object/${selectedBandwidthDevice}`,
          "GET",
          null,
          false
        );
        setAddressOptions(sourceResponse?.response?.addressobj_array || []);

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

  const handleSubmitForm1 = () => {
    toast({ description: "Form 1 submitted successfully!" });
    toggleModal();
  };

  const handleSubmitForm2 = () => {
    toast({ description: "Form 2 submitted successfully!" });
    toggleModal();
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
          <Button onClick={toggleModal} variant="ghost" size="icon">
            <XIcon size={20} />
          </Button>
          {/* Header with Tabs */}
          <div className="flex justify-center items-center p-4 border-b">
            <div className="flex space-x-4">
              <Button
                className="min-w-40"
                variant={activeTab === "form1" ? "default" : "outline"}
                onClick={() => setActiveTab("form1")}
              >
                Add Source IP
              </Button>
              <Button
                className="min-w-40"
                variant={activeTab === "form2" ? "default" : "outline"}
                onClick={() => setActiveTab("form2")}
              >
                Add Destination IP
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 text-left">
            {activeTab === "form1" && (
              <>
                {/* Name Field */}
                <div className="bg-background rounded-lg">
                  <Label className="mb-4">Name</Label>
                  <Input
                    type="text"
                    className="input w-full text-white p-2"
                    placeholder="Enter name"
                  />
                </div>

                {/* Remarks Field */}
                <div>
                  <Label className="mb-2">Remarks</Label>
                  <Input
                    type="text"
                    className="input w-full text-white p-2"
                    placeholder="Enter remarks"
                  />
                </div>

                {/* Tips */}
                <div className="flex items-start space-x-2 text-white py-2">
                  <LightbulbIcon className="mt-1 " size={20} />
                  <p className="text-sm ">
                    Add useful tips here to guide users on completing the form.
                  </p>
                </div>
              </>
            )}

            {activeTab === "form2" && (
              <>
                {/* Name Field */}
                <div>
                  <Label className="mb-2">Name</Label>
                  <Input
                    type="text"
                    className="input w-full"
                    placeholder="Enter name"
                  />
                </div>

                {/* Start and End IP Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2">Start IP</Label>
                    <Input
                      type="text"
                      className="input w-full"
                      placeholder="Enter start IP"
                    />
                  </div>
                  <div>
                    <Label className="mb-2">End IP</Label>
                    <Input
                      type="text"
                      className="input w-full"
                      placeholder="Enter end IP"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center p-4 border-t">
            <Button onClick={toggleModal} variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={
                activeTab === "form1" ? handleSubmitForm1 : handleSubmitForm2
              }
              variant="default"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
