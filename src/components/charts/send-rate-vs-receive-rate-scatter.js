import React from 'react';
import { format } from 'd3-format';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['hsl(130, 89%, 25%)'];

function SendRecvRateChart({ ipData }) {
    // Flatten SendRate and RecvRate data
    const sendRates = ipData.map(ip => ip.Streams.map(stream => stream.SendRate));
    const recvRates = ipData.map(ip => ip.Streams.map(stream => stream.RecvRate));

    const sendRateData = sendRates.flat();
    const recvRateData = recvRates.flat();

    const rateData = sendRateData.map((sendRate, index) => ({
        x: sendRate,
        y: recvRateData[index]
    }));

    return (
        <div className="w-full bg-white/5 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Send Rate vs Receive Rate</h2>
            <div className="h-[300px] flex justify-center">
                {/* Wrap the ScatterChart with ResponsiveContainer */}
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(130, 20%, 18%)" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Send Rate"
                            stroke="hsl(130,5%,90%)"
                            label={{ fill: 'hsl(130,5%,90%)' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Receive Rate"
                            stroke="hsl(130,5%,90%)"
                            label={{ fill: 'hsl(130,5%,90%)' }}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{
                                backgroundColor: 'white',  // Set background to white
                                border: '1px solid hsl(130, 20%, 18%)',
                                color: 'hsl(130, 5%, 90%)'
                            }}
                            formatter={(value, name) => {
                                // Format the tooltip to display values and labels, including negative values
                                return [format(".0s")(value), name];
                            }}
                        />
                        <Scatter
                            name="Rates"
                            data={rateData}
                            fill="hsla(130, 89%, 25%, 0.6)"
                            shape="circle"
                        />
                        <Legend
                            wrapperStyle={{
                                color: 'hsl(130,5%,90%)'
                            }}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SendRecvRateChart;