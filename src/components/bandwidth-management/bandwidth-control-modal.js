"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Wifi } from "lucide-react";
import BandwidthModal from "./bandwidth-modal";
import FlowModal from "./flow-modal";
import SourceIpModal from "./source-ip-modal";
import DestinationIpModal from "./destination-ip-modal";
import DepartmentModal from "./department-modal";
import { Plus } from "lucide-react";

export default function BandwidthControlModal({ activeTab }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const renderTabContent = () => {
    switch (activeTab) {
      case "bandwidth":
        return <BandwidthModal toggleModal={toggleModal} />;
      case "flow":
        return <FlowModal toggleModal={toggleModal} />;
      case "source-ip":
        return <SourceIpModal toggleModal={toggleModal} />;
      case "destination-ip":
        return <DestinationIpModal toggleModal={toggleModal} />;
      case "department":
        return <DepartmentModal toggleModal={toggleModal} />;
      default:
        return <div>Select a tab to configure settings</div>;
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button className="py-5" onClick={toggleModal} size="sm" variant="secondary">
        <Plus />
        Add{" "}
        {activeTab === "bandwidth"
          ? "Bandwidth"
          : activeTab === "flow"
          ? "Flow"
          : activeTab === "source-ip"
          ? "Source IP"
          : activeTab === "destination-ip"
          ? "Destination Ip"
          : "Department"}
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleModal}
          />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">{activeTab} Settings</h2>
              <Button onClick={toggleModal} variant="ghost" size="icon">
                <XIcon size={20} />
              </Button>
            </div>

            <div className="p-4 space-y-4">{renderTabContent()}</div>

            <div className="flex justify-end items-center p-4 border-t">
              <Button onClick={toggleModal} variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button
                onClick={() => alert("Form submitted!")}
                variant="default"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
