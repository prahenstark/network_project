import React from 'react';
import { format } from 'd3-format';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const ByteSendReciveChart = ({ ipData }) => {
    // Define a custom tick formatter function for the Y-axis
    const yAxisTickFormatter = (value) => {
        return format(".0s")(value); // This will format large numbers as k, M, B, etc.
    };

    // Process data for charts
    const totalBytes = ipData.map(ip => ({
        name: ip.Ip,
        sent: ip.Streams.reduce((sum, stream) => sum + parseInt(stream.SndBytes), 0),
        received: ip.Streams.reduce((sum, stream) => sum + parseInt(stream.RcvBytes), 0)
    }));

    return (
        <div className='w-full bg-white/10 rounded-lg p-4'>
            <div className="w-full">
                <h2 className="text-xl font-semibold mb-4">Total Sent and Received Bytes per IP</h2>
                <div className="h-[300px] w-full">
                    {/* ResponsiveContainer adjusts the chart size according to the screen */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={totalBytes}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(130,20%,18%)" />
                            <XAxis dataKey="name" stroke="hsl(130,5%,90%)" />
                            <YAxis tickFormatter={yAxisTickFormatter} stroke="hsl(130,5%,90%)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(130,12%,10%)',
                                    border: '1px solid hsl(130,20%,18%)',
                                    color: 'hsl(130,5%,90%)'
                                }}
                                formatter={(value, name) => {
                                    return [yAxisTickFormatter(value), name]; // Format the tooltip value
                                }}
                            />
                            <Legend />
                            <Bar dataKey="sent" fill="hsl(130,89%,25%)" name="Sent Bytes" />
                            <Bar dataKey="received" fill="hsl(93, 74.00%, 84.90%)" name="Received Bytes" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ByteSendReciveChart;