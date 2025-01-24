import React from "react";
import { IDevice } from "../types";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface DeviceChartProps {
	devices: IDevice[];
}

const DeviceChart: React.FC<DeviceChartProps> = ({ devices }) => {
	const chartData = devices.map((dev) => ({
		name: dev.name,
		performance: dev.specifications.performanceScore || 0,
	}));

	return (
		<div style={{ width: "100%", height: "400px" }}>
			<ResponsiveContainer>
				<BarChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="performance" fill="#8884d8" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default DeviceChart;
