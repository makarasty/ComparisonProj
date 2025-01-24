import React, { useState } from "react";
import { IDevice } from "../types";
import DeviceChart from "../components/DeviceChart";

const sampleDevices: IDevice[] = [
	{
		_id: "1",
		name: "Gaming GPU X",
		category: "graphics-card",
		brand: "BrandA",
		specifications: { price: 500, performanceScore: 90 },
		rating: 4.5,
	},
	{
		_id: "2",
		name: "Budget GPU Y",
		category: "graphics-card",
		brand: "BrandB",
		specifications: { price: 300, performanceScore: 70 },
		rating: 4.0,
	},
];

const ComparePage: React.FC = () => {
	const [devices] = useState<IDevice[]>(sampleDevices);

	return (
		<div className="container">
			<h1>Compare Devices</h1>
			<p>Selected devices: {devices.length}</p>

			<DeviceChart devices={devices} />

			{}
			{}
		</div>
	);
};

export default ComparePage;
