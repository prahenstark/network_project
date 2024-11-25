"use client";
import { Network } from "lucide-react";
import { Signal } from "lucide-react";
import { User } from "lucide-react";
import { Wifi } from "lucide-react";
import React, { useState } from "react";
import ReactFlow, { Controls, MiniMap, Background } from "reactflow";
import "reactflow/dist/style.css";

const IconGateway = () => <span>🌐</span>;
const IconAccessPoint = () => <span>📡</span>;
const IconUser = () => <span>👤</span>;

const FlowchartVisualization = ({ data }) => {
  const [expandedNode, setExpandedNode] = useState(null); // State to track the expanded node

  const toggleChildren = (nodeId) => {
    setExpandedNode((prev) => (prev === nodeId ? null : nodeId));
  };

  const nodes = [];
  const edges = [];

  // Constants for layout
  const ROOT_Y = 0;
  const ROOT_X_SPACING = 400; // Spacing between access points
  const CHILD_Y_SPACING = 600; // Vertical spacing for child nodes
  const CHILD_X_SPACING = 260; // Increased horizontal spacing between child nodes
  const ROOT_NODE_WIDTH = 300; // Width of the root node

  // Calculate the center position for the root node
  const centerX = ((data.wtp_array.length - 1) * ROOT_X_SPACING + 150) / 2;

  // Add root node (Gateway)
  const rootId = "gateway-root";
  nodes.push({
    id: rootId,
    position: { x: centerX, y: ROOT_Y },
    data: {
      label: (
        <div className="font-primary flex flex-col gap-2">
          <img
            src="/assets/gateway.svg"
            alt="Gateway"
            className="size-[80px] mx-auto"
          />
          Gateway
          <span className="bg-primary/10 border border-primary/20 mb-2 text-primary font-primary font-medium py-2 rounded-full">
            {data.wtp_array[0]?.gateway || "Unknown"}
          </span>
        </div>
      ),
    },
    style: {
      backgroundColor: "#ffffff",
      padding: "10px",
      borderRadius: "8px",
    },
  });

  // Add WTP arrays (Access Points) and their children (Users)
  data.wtp_array.forEach((wtp, wtpIndex) => {
    const wtpId = `wtp-${wtpIndex}`;

    // Add Access Point node
    nodes.push({
      id: wtpId,
      position: { x: wtpIndex * ROOT_X_SPACING, y: ROOT_Y + CHILD_Y_SPACING },
      data: {
        label: (
          <div
            onClick={() => toggleChildren(wtpId)}
            style={{ cursor: "pointer" }}
          >
            <img
              src="/assets/accesspoint.png"
              alt="png"
              className="size-[80px] mx-auto"
            />
            <div className="flex flex-col gap-2 mt-2">
              <h5>Access Point</h5>
              <span className="bg-yellow-500/10 border border-yellow-800/20 mb-2 text-yellow-900 font-primary text-[10px] font-medium py-2 rounded-full">
                {wtp.ManageMac}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="bg-blue-50 p-2 rounded font-primary">
                <span className="text-blue-600 ">Uptime</span>
                <p className="text-blue-600 mt-1 font-semibold">
                  {wtp.uptime}s
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded font-primary">
                <span className="text-green-600">IP</span>
                <p className="text-green-600 mt-1 font-semibold">
                  {wtp.ipaddr}
                </p>
              </div>
              <div className="bg-purple-50 p-2 rounded font-primary">
                <span className="text-purple-600">CPU Load</span>
                <p className="text-purple-600 mt-1 font-semibold">
                  {wtp.cpuload}%
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded font-primary">
                <span className="text-red-600 font-semibold">Temperature</span>
                <p className="text-red-600 mt-1 font-semibold">
                  {wtp.temprature}°C
                </p>
              </div>
            </div>
          </div>
        ),
      },
      style: {
        backgroundColor: "#ffffff",
        padding: "8px",
        borderRadius: "6px",
        width: "300px",
      },
    });

    // Connect Gateway to Access Point
    edges.push({
      id: `edge-${rootId}-${wtpId}`,
      source: rootId,
      target: wtpId,
    });

    // Add child nodes (Users from radios_array) if the parent is expanded
    if (expandedNode === wtpId) {
      wtp.radios_array.forEach((radio, radioIndex) => {
        const radioId = `${wtpId}-radio-${radioIndex}`;

        // Calculate the horizontal position dynamically based on the number of radios
        const childXPosition =
          wtpIndex * ROOT_X_SPACING +
          (radioIndex - (wtp.radios_array.length - 1) / 2) * CHILD_X_SPACING;

        nodes.push({
          id: radioId,
          position: {
            x: childXPosition,
            y: ROOT_Y + 2 * CHILD_Y_SPACING,
          },
          data: {
            label: (
              <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-50 p-4 rounded-full mb-2">
                    <img
                      src="/assets/user.svg"
                      alt="User Icon"
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  <div className="w-full flex flex-col gap-6 font-primary">
                    <div className="flex items-center justify-between rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <span className="text-gray-500 flex flex-row gap-2 items-center text-sm font-medium">
                        <User size={16} />
                        User
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {radio.RadioID}
                      </span>
                    </div>

                    <div className="flex items-center justify-between  rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <span className="text-gray-500 flex flex-row gap-2 items-center text-sm font-medium">
                        <Signal size={16} /> Signal
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {radio.StationRssi || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between  rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <span className="text-gray-500 flex flex-row gap-2 items-center text-sm font-medium">
                        <Wifi size={16} /> MAC
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {radio.StationMac || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between  rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <span className="text-gray-500 flex flex-row gap-2 items-center text-sm font-medium">
                        <Network size={16} /> IP
                      </span>
                      <span className="text-gray-900 font-semibold break-all">
                        {radio.StationIPAddr || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          style: {
            backgroundColor: "transparent",
            padding: 0,
            borderRadius: "12px",
            width: "240px",
          },
        });

        // Connect Access Point to User
        edges.push({
          id: `edge-${wtpId}-${radioId}`,
          source: wtpId,
          target: radioId,
        });
      });
    }
  });

  return (
    <div className="h-screen bg-white/5">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        style={{ width: "100%", height: "100%" }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default function Tree() {
  const apiResponse = {
    ret: 0,
    Count: 2,
    wtp_array: [
      {
        ManageMac: "44-D1-FA-EF-58-FC",
        upgradeTime: 1000,
        uptime: 16400,
        ipaddr: "192.168.10.52",
        netmask: "255.255.255.0",
        gateway: "192.168.10.40",
        cpuload: 5,
        temprature: 45,
        wlanCnt: 2,
        wlans_array: [
          {
            Channel: 7,
            RadioID: 1,
            WlanID: 1,
            rxBytes: "5000",
            txBytes: "3000",
            rxPkts: 50,
            txPkts: 30,
          },
          {
            Channel: 136,
            RadioID: 2,
            WlanID: 2,
            rxBytes: "10000",
            txBytes: "8000",
            rxPkts: 100,
            txPkts: 80,
          },
        ],
        stationCnt: 2,
        radios_array: [
          {
            phyStandard2400MH: 1,
            RadioID: 1,
            WlanID: 1,
            StationMac: "66-5c-51-2c-a1-01",
            StationIPAddr: "192.168.10.101",
            StationRssi: -55,
            StationRxPkts: 500,
            StationTxPkts: 50,
            rxBytes: "45000",
            txBytes: "3000",
          },
          {
            phyStandard2400MH: 1,
            RadioID: 1,
            WlanID: 1,
            StationMac: "66-5c-51-2c-a1-01",
            StationIPAddr: "192.168.10.101",
            StationRssi: -55,
            StationRxPkts: 500,
            StationTxPkts: 50,
            rxBytes: "45000",
            txBytes: "3000",
          },
          {
            phyStandard2400MH: 1,
            RadioID: 1,
            WlanID: 1,
            StationMac: "66-5c-51-2c-a1-01",
            StationIPAddr: "192.168.10.101",
            StationRssi: -55,
            StationRxPkts: 500,
            StationTxPkts: 50,
            rxBytes: "45000",
            txBytes: "3000",
          },
          {
            phyStandard2400MH: 1,
            RadioID: 1,
            WlanID: 1,
            StationMac: "66-5c-51-2c-a1-01",
            StationIPAddr: "192.168.10.101",
            StationRssi: -55,
            StationRxPkts: 500,
            StationTxPkts: 50,
            rxBytes: "45000",
            txBytes: "3000",
          },
          {
            phyStandard2400MH: 1,
            RadioID: 1,
            WlanID: 1,
            StationMac: "66-5c-51-2c-a1-01",
            StationIPAddr: "192.168.10.101",
            StationRssi: -55,
            StationRxPkts: 500,
            StationTxPkts: 50,
            rxBytes: "45000",
            txBytes: "3000",
          },
          {
            phyStandard2400MH: 1,
            RadioID: 1,
            WlanID: 1,
            StationMac: "66-5c-51-2c-a1-01",
            StationIPAddr: "192.168.10.101",
            StationRssi: -55,
            StationRxPkts: 500,
            StationTxPkts: 50,
            rxBytes: "45000",
            txBytes: "3000",
          },
          {
            phyStandard2400MH: 0,
            RadioID: 2,
            WlanID: 2,
            StationMac: "66-5c-51-2c-a1-02",
            StationIPAddr: "192.168.10.102",
            StationRssi: -65,
            StationRxPkts: 600,
            StationTxPkts: 60,
            rxBytes: "55000",
            txBytes: "4000",
          },
        ],
      },
      {
        ManageMac: "44-D1-FA-FA-34-6A",
        upgradeTime: 2000,
        uptime: 16450,
        ipaddr: "192.168.10.51",
        netmask: "255.255.255.0",
        gateway: "192.168.10.40",
        cpuload: 10,
        temprature: 50,
        wlanCnt: 2,
        wlans_array: [
          {
            Channel: 13,
            RadioID: 1,
            WlanID: 1,
            rxBytes: "15000",
            txBytes: "12000",
            rxPkts: 150,
            txPkts: 120,
          },
          {
            Channel: 100,
            RadioID: 2,
            WlanID: 2,
            rxBytes: "20000",
            txBytes: "18000",
            rxPkts: 200,
            txPkts: 180,
          },
        ],
        stationCnt: 1,
        radios_array: [
          {
            phyStandard2400MH: 1,
            RadioID: 2,
            WlanID: 1,
            StationMac: "66-5c-51-2c-b0-79",
            StationIPAddr: "192.168.10.100",
            StationRssi: -60,
            StationRxPkts: 763,
            StationTxPkts: 14,
            rxBytes: "70210",
            txBytes: "1900",
          },
        ],
      },
      {
        ManageMac: "44-D1-FA-FA-34-6A",
        upgradeTime: 2000,
        uptime: 16450,
        ipaddr: "192.168.10.51",
        netmask: "255.255.255.0",
        gateway: "192.168.10.40",
        cpuload: 10,
        temprature: 50,
        wlanCnt: 2,
        wlans_array: [
          {
            Channel: 13,
            RadioID: 1,
            WlanID: 1,
            rxBytes: "15000",
            txBytes: "12000",
            rxPkts: 150,
            txPkts: 120,
          },
          {
            Channel: 100,
            RadioID: 2,
            WlanID: 2,
            rxBytes: "20000",
            txBytes: "18000",
            rxPkts: 200,
            txPkts: 180,
          },
        ],
        stationCnt: 1,
        radios_array: [
          {
            phyStandard2400MH: 1,
            RadioID: 2,
            WlanID: 1,
            StationMac: "66-5c-51-2c-b0-79",
            StationIPAddr: "192.168.10.100",
            StationRssi: -60,
            StationRxPkts: 763,
            StationTxPkts: 14,
            rxBytes: "70210",
            txBytes: "1900",
          },
        ],
      },
    ],
  };

  return (
    <div>
      <FlowchartVisualization data={apiResponse} />
    </div>
  );
}
