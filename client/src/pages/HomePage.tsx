import React, { useEffect, useState } from "react";
import { fetchDevices } from "../api/deviceApi";
import { IDevice, DeviceCategory } from "../types";
import DeviceTable from "../components/DeviceTable";

const HomePage: React.FC = () => {
	const [devices, setDevices] = useState<IDevice[]>([]);
	const [category, setCategory] = useState<DeviceCategory | "">("");
	const [minPrice, setMinPrice] = useState<number | "">("");
	const [maxPrice, setMaxPrice] = useState<number | "">("");

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			const data = await fetchDevices();
			setDevices(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleFilter = () => {
		loadData();

		setDevices((prev) =>
			prev.filter((d) => {
				if (category && d.category !== category) return false;

				const price = d.specifications.price || 0;
				if (minPrice !== "" && price < minPrice) return false;
				if (maxPrice !== "" && price > maxPrice) return false;

				return true;
			}),
		);
	};

	return (
		<div className="container">
			<h1>Technology Comparison</h1>

			<div style={{ marginBottom: 20 }}>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value as DeviceCategory | "")}
				>
					<option value="">All categories</option>
					<option value="tv">TV</option>
					<option value="graphics-card">Graphics Card</option>
					<option value="smartphone">Smartphone</option>
					<option value="laptop">Laptop</option>
					<option value="sofa">Sofa</option>
					<option value="fridge">Fridge</option>
					<option value="other">Other</option>
				</select>

				<input
					type="number"
					placeholder="Min price"
					value={minPrice}
					onChange={(e) =>
						setMinPrice(e.target.value ? parseInt(e.target.value, 10) : "")
					}
					style={{ marginLeft: 10 }}
				/>
				<input
					type="number"
					placeholder="Max price"
					value={maxPrice}
					onChange={(e) =>
						setMaxPrice(e.target.value ? parseInt(e.target.value, 10) : "")
					}
					style={{ marginLeft: 10 }}
				/>

				<button onClick={handleFilter} style={{ marginLeft: 10 }}>
					Filter
				</button>
			</div>

			<DeviceTable devices={devices} />
		</div>
	);
};

export default HomePage;
