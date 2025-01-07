'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wifi } from "lucide-react";

export default function BandwidthControlModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceType, setSourceType] = useState("address"); // Tracks the selected source type
  const [isUpstreamUnlimited, setIsUpstreamUnlimited] = useState(true);
  const [isDownstreamUnlimited, setIsDownstreamUnlimited] = useState(true);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={toggleModal} size="icon" variant="secondary">
        <Wifi />
      </Button>

      {/* Modal */}
      {isModalOpen && (
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
                <Select value={sourceType} onValueChange={(value) => setSourceType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Source Address" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address">Address</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="level">Level</SelectItem>
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
                  <Input id="address" type="text" placeholder="Enter address" />
                </div>
              )}
              {sourceType === "user" && (
                <div>
                  <Label htmlFor="user" className="mb-2">
                    Enter User:
                  </Label>
                  <Input id="user" type="text" placeholder="Enter username" />
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
                  <Input id="department" type="text" placeholder="Enter department" />
                </div>
              )}

              {/* Divider */}
              <div className="border-t my-4" />

              {/* Time */}
              <div>
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
              </div>

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
                  <Input id="upstream" type="number" placeholder="Enter upstream limit" />
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
                  <Input id="downstream" type="number" placeholder="Enter downstream limit" />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center p-4 border-t">
              <Button onClick={toggleModal} variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button onClick={() => alert("Form submitted!")} variant="default">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
