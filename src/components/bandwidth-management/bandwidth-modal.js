import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import { fetchDashboardInfo, fetchProtectedInfo } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Wifi } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function BandwidthModal({ toggleModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpstreamUnlimited, setIsUpstreamUnlimited] = useState(true);
  const [isDownstreamUnlimited, setIsDownstreamUnlimited] = useState(true);
  const { selectedBandwidthDevice } = useBandwidthDevice();

  const [addressOptions, setAddressOptions] = useState([]); // Stores address options for the dropdown
  const [userOptions, setUserOptions] = useState([]); // Stores user options
  const [departmentOptions, setDepartmentOptions] = useState([]); // Stores department options
  const [sourceType, setSourceType] = useState("address"); // Tracks the selected source type
  const [selectedField, setSelectedField] = useState("");
  const [upstreamLimit, setUpstreamLimit] = useState(0);
  const [downstreamLimit, setDownstreamLimit] = useState(0);

  // Fetch address options when sourceType is 'address'
  useEffect(() => {
    console.log("Selected device", selectedBandwidthDevice);
    if (sourceType === "address") {
      const fetchAddressOptions = async () => {
        try {
          const data = await fetchProtectedInfo(
            `/devices/address-object/${selectedBandwidthDevice}`
          );
          // Extract Name values from addressobj_array
          const addressNames =
            data.response?.addressobj_array?.map((obj) => obj.Name) || [];
          setAddressOptions(addressNames);
        } catch (error) {
          console.error("Error fetching address options:", error);
        }
      };

      fetchAddressOptions();
    }
  }, [sourceType, selectedBandwidthDevice]);

  // Fetch user options when sourceType is 'user'
  useEffect(() => {
    if (sourceType === "user") {
      const fetchUserOptions = async () => {
        try {
          const data = await fetchDashboardInfo(
            "/account?pageOffset=10&pageIndex=1&status=2"
          );

          // Assuming the API returns a list of user names in a field called `user_list`
          const userNames = data?.users.map((obj) => obj.nickname) || [];
          setUserOptions(userNames);
        } catch (error) {
          console.error("Error fetching user options:", error);
        }
      };

      fetchUserOptions();
    }
  }, [sourceType]);

  // Fetch user options when sourceType is 'department'
  useEffect(() => {
    console.log("Selected device", selectedBandwidthDevice);
    if (sourceType === "address") {
      const fetchAddressOptions = async () => {
        try {
          const data = await fetchProtectedInfo(
            `/devices/get-department/${selectedBandwidthDevice}`
          );
          // Extract Name values from addressobj_array
          const departmentNames =
            data.response?.department_array?.map((obj) => obj.Name) || [];
          setDepartmentOptions(departmentNames);
        } catch (error) {
          console.error("Error fetching address options:", error);
        }
      };

      fetchAddressOptions();
    }
  }, [sourceType, selectedBandwidthDevice]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      Enabled: 1,
      AddrType: sourceType === "address" ? 1 : sourceType === "user" ? 2 : 4,
      Address: selectedField,
      Schedule: "ANY",
      Obj: {
        MaxUpBandWidth: isUpstreamUnlimited ? 0 : upstreamLimit,
        MaxDownBandWidth: isDownstreamUnlimited ? 0 : downstreamLimit,
        MaxUpP2pBandWidth: 90,
        MaxDownP2pBandWidth: 90,
        ExceptLines: [0, 0, 0, 0, 0, 0],
        BandCtls: Array(6).fill({ UpBandWidth: 0, DownBandWidth: 0 }),
        MaxLimit: isUpstreamUnlimited && isDownstreamUnlimited ? 0 : 3,
        MaxP2pLimit: 3,
      },
    };

    try {
      const response = await fetchDashboardInfo(
        `/devices/bandwidth-rules/${selectedBandwidthDevice}?action=add`,
        "PUT",
        payload,
        false
      );
      console.log("API Payload:", payload);
      console.log("API Response:", response);

      if (response.status !== 200) {
        toast({
          description: "There was an error adding the bandwidth rule.",
          variant: "destructive",
        });
        return;
      }

      toast({ description: "Bandwidth rule added successfully!" });
      window.location.reload(); // Reloads the page after successful submission
      toggleModal(); // Closes the modal
    } catch (error) {
      console.error("Error adding bandwidth rule:", error);
      toast({
        description: "There was an error adding the bandwidth rule.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          {/* Source Address */}
          <div>
            <Label htmlFor="source-address" className="mb-2">
              Source Address:
            </Label>
            <Select
              value={sourceType}
              onValueChange={(value) => setSourceType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Source Address" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="address">Address</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Content Based on Source Type */}
          {sourceType === "address" && (
            <div>
              <Label htmlFor="address" className="mb-2">
                Enter Address:
              </Label>
              <Select onValueChange={setSelectedField}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an address" />
                </SelectTrigger>
                <SelectContent>
                  {addressOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {sourceType === "user" && (
            <div>
              <Label htmlFor="user" className="mb-2">
                Select User:
              </Label>
              <Select onValueChange={setSelectedField}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {sourceType === "level" && (
            <div>
              <Label htmlFor="level" className="mb-2">
                Enter Level:
              </Label>
              <Input id="level" type="text" placeholder="Enter level" />
            </div>
          )}
          {sourceType === "department" && (
            <div>
              <Label htmlFor="department" className="mb-2">
                Enter Department:
              </Label>
              <Select onValueChange={setSelectedField}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Divider */}
          <div className="border-t my-4" />

          {/* Time */}
          {/* <div>
            <Label htmlFor="time" className="mb-2">
              Time:
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="specific">Specific</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Upstream Limit */}
          <div>
            <Label htmlFor="upstream" className="mb-2">
              Upstream Limit (KB):
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isUpstreamUnlimited}
                onCheckedChange={(checked) =>
                  setIsUpstreamUnlimited(Boolean(checked))
                }
              />
              <span>Unlimited</span>
            </div>
            {!isUpstreamUnlimited && (
              <Input
                id="upstream"
                type="number"
                placeholder="Enter upstream limit"
                value={upstreamLimit}
                onChange={(e) => setUpstreamLimit(Number(e.target.value))}
              />
            )}
          </div>

          {/* Downstream Limit */}
          <div>
            <Label htmlFor="downstream" className="mb-2">
              Downstream Limit (KB):
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isDownstreamUnlimited}
                onCheckedChange={(checked) =>
                  setIsDownstreamUnlimited(Boolean(checked))
                }
              />
              <span>Unlimited</span>
            </div>
            {!isDownstreamUnlimited && (
              <Input
                id="downstream"
                type="number"
                placeholder="Enter downstream limit"
                value={downstreamLimit}
                onChange={(e) => setDownstreamLimit(Number(e.target.value))}
              />
            )}
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
  );
}
