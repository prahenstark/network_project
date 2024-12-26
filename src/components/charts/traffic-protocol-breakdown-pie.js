import React, { useEffect, useState } from 'react';
import { format } from 'd3-format';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['hsl(130,89%,25%)', 'hsl(93, 74.00%, 84.90%)'];

function TrafficProtocolBreakDownPie({ ipData }) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const protocolData = [
        { name: 'TCP', value: ipData.reduce((acc, ip) => acc + ip.TCPCount, 0) },
        { name: 'UDP', value: ipData.reduce((acc, ip) => acc + ip.UDPCount, 0) }
    ];

    // Calculate radius based on screen size
    const getResponsiveRadius = () => {
        if (screenWidth < 640) { // Small screens
            return {
                inner: "50%",
                outer: "70%"
            };
        } else if (screenWidth < 1024) { // Medium screens
            return {
                inner: "55%",
                outer: "75%"
            };
        } else { // Large screens
            return {
                inner: "60%",
                outer: "80%"
            };
        }
    };

    const radius = getResponsiveRadius();
    const totalValue = protocolData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="w-full bg-white/5 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Protocol Distribution</h2>
            <div className="h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={protocolData}
                            cx="50%"
                            cy="50%"
                            innerRadius={radius.inner}
                            outerRadius={radius.outer}
                            fill="hsl(130, 98.70%, 31.00%)"
                            dataKey="value"
                            label={({
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                value,
                                name
                            }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = outerRadius * 1.1;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        className="text-sm md:text-base"
                                        textAnchor={x > cx ? 'start' : 'end'}
                                        dominantBaseline="central"
                                        fill="hsl(130,5%,90%)"
                                    >
                                        {`${name} (${format(".0%")(value / totalValue)})`}
                                    </text>
                                );
                            }}
                        >
                            {protocolData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid hsl(130,20%,18%)',
                                color: 'hsl(130,5%,90%)'
                            }}
                            formatter={(value) => [
                                `${format(",")(value)} packets`,
                                'Count'
                            ]}
                        />
                        <Legend 
                            wrapperStyle={{
                                fontSize: screenWidth < 640 ? '0.875rem' : '1rem'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TrafficProtocolBreakDownPie;