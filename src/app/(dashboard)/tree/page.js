"use client";
import React, { useState, useEffect } from "react";
import ReactFlow, { Controls, MiniMap, Background } from "reactflow";
import axios from "axios";
import "reactflow/dist/style.css";
import { API_URL } from "@/lib/api";
import { Network } from "lucide-react";
import { Wifi } from "lucide-react";
import { Signal } from "lucide-react";
import { User } from "lucide-react";

const FlowchartVisualization = ({ data }) => {
  const [expandedGateway, setExpandedGateway] = useState(null);
  const [expandedAccessPoint, setExpandedAccessPoint] = useState(null);

  const toggleGateway = (gatewayId) => {
    setExpandedGateway((prev) => (prev === gatewayId ? null : gatewayId));
    setExpandedAccessPoint(null); // Reset access points when switching gateways
  };

  const toggleAccessPoint = (accessPointId) => {
    setExpandedAccessPoint((prev) =>
      prev === accessPointId ? null : accessPointId
    );
  };

  const nodes = [];
  const edges = [];

  const ROOT_Y = 0;
  const GATEWAY_X_SPACING = 200;
  const ROOT_X_SPACING = 400;
  const CHILD_Y_SPACING = 600;
  const CHILD_X_SPACING = 260;

  data.forEach((gateway, gatewayIndex) => {
    const gatewayId = `gateway-${gatewayIndex}`;
    const gatewayX = gatewayIndex * GATEWAY_X_SPACING;
    const centerX = ((gateway.wtp_array.length - 1) * ROOT_X_SPACING + 150) / 2;

    nodes.push({
      id: gatewayId,
      position: { x: gatewayX + centerX, y: ROOT_Y },
      data: {
        label: (
          <div
            className="font-primary flex flex-col gap-2"
            onClick={() => toggleGateway(gatewayId)}
            style={{ cursor: "pointer" }}
          >
            <img
              src="/assets/gateway.svg"
              alt="Gateway"
              className="size-[80px] mx-auto"
            />
            Gateway
            <span className="bg-primary/10 border border-primary/20 mb-2 text-primary font-primary font-medium py-2 rounded-full">
              {gateway.wtp_array[0]?.gateway || "Unknown"}
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

    if (expandedGateway === gatewayId) {
      gateway.wtp_array.forEach((wtp, wtpIndex) => {
        const wtpId = `gateway-${gatewayIndex}-wtp-${wtpIndex}`;
        nodes.push({
          id: wtpId,
          position: {
            x: gatewayX + wtpIndex * ROOT_X_SPACING,
            y: ROOT_Y + CHILD_Y_SPACING,
          },
          data: {
            label: (
              <div
                onClick={() => toggleAccessPoint(wtpId)}
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
                    <span className="text-red-600 font-semibold">
                      Temperature
                    </span>
                    <p className="text-red-600 mt-1 font-semibold">
                      {wtp.temprature}°C
                    </p>
                  </div>
                </div>
                <div className="my-2">
                  <div className="bg-green-50 p-2 rounded font-primary">
                    <span className="text-green-600 font-semibold">User</span>
                    <p className="text-green-600 mt-1 font-semibold">
                      {wtp.radios_array && wtp.radios_array.length}
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

        edges.push({
          id: `edge-${gatewayId}-${wtpId}`,
          source: gatewayId,
          target: wtpId,
        });

        if (expandedAccessPoint === wtpId) {
          wtp.radios_array.forEach((radio, radioIndex) => {
            const radioId = `${wtpId}-radio-${radioIndex}`;
            nodes.push({
              id: radioId,
              position: {
                x:
                  gatewayX +
                  wtpIndex * ROOT_X_SPACING +
                  radioIndex * CHILD_X_SPACING,
                y: ROOT_Y + 2 * CHILD_Y_SPACING,
              },
              data: {
                label: (
                  <div className="bg-white rounded-xl shadow-lg p-6 w-[300px] mx-auto border border-gray-100">
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

            edges.push({
              id: `edge-${wtpId}-${radioId}`,
              source: wtpId,
              target: radioId,
            });
          });
        }
      });
    }
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      style={{ width: "100%", height: "100%" }}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default function Tree() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("bearerToken");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/devices/access-points`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {data === null ? (
        "Loading..."
      ) : data?.gateways && data.gateways.length > 0 ? (
        <FlowchartVisualization data={data.gateways} />
      ) : (
        <div className="grid place-content-center w-full h-full text-white">
          No data available
        </div>
      )}
    </div>
  );
}
