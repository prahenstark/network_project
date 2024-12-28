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

const TrafficStreamBreakDownChart = ({ ipData }) => {
    // Define a custom tick formatter function for the Y-axis
    const yAxisTickFormatter = (value) => {
        return format(".0s")(value); // This will format large numbers as k, M, B, etc.
    };

    // Process data for charts - fix the data key names to match the Bar dataKey
    const streamData = ipData.map(ip => ({
        name: ip.Ip,
        sent: ip.Streams.reduce((sum, stream) => sum + parseInt(stream.SndBytes || 0), 0),
        received: ip.Streams.reduce((sum, stream) => sum + parseInt(stream.RcvBytes || 0), 0)
    }));

    return (
        <div className="w-full bg-white/10 rounded-lg p-4">
            <div className="w-full">
                <h2 className="text-xl font-semibold mb-4">Traffic Streams Breakdown per IP</h2>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={streamData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="hsl(130,20%,18%)" 
                                opacity={0.1}
                            />
                            <XAxis 
                                dataKey="name" 
                                stroke="hsl(130,5%,90%)"
                                fontSize={12}
                            />
                            <YAxis 
                                tickFormatter={yAxisTickFormatter} 
                                stroke="hsl(130,5%,90%)"
                                fontSize={12}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(130,12%,10%)',
                                    border: '1px solid hsl(130,20%,18%)',
                                    color: 'hsl(130,5%,90%)',
                                    borderRadius: '4px',
                                    padding: '8px'
                                }}
                                formatter={(value, name) => [yAxisTickFormatter(value), name]}
                                labelStyle={{ color: 'hsl(130,5%,90%)' }}
                            />
                            <Legend 
                                wrapperStyle={{ 
                                    color: 'hsl(130,5%,90%)',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar 
                                dataKey="sent" 
                                fill="hsl(130,89%,25%)" 
                                name="Sent Bytes"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                                dataKey="received" 
                                fill="hsl(93, 74%, 85%)" 
                                name="Received Bytes"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TrafficStreamBreakDownChart;