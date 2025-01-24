import React from "react";
import { IDevice } from "../types";

interface DeviceTableProps {
	devices: IDevice[];
}

const DeviceTable: React.FC<DeviceTableProps> = ({ devices }) => {
	const columns = [
		"Name",
		"Brand",
		"Category",
		"Price",
		"Performance",
		"Rating",
	];

	return (
		<table
			style={{
				width: "100%",
				borderCollapse: "collapse",
			}}
			border={1}
			cellPadding={5}
		>
			<thead>
				<tr>
					{columns.map((col) => (
						<th key={col}>{col}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{devices.map((device) => {
					const { _id, name, brand, category, specifications, rating } = device;
					const price = specifications.price || "-";
					const perfScore = specifications.performanceScore || "-";

					return (
						<tr key={_id}>
							<td>{name}</td>
							<td>{brand || "-"}</td>
							<td>{category}</td>
							<td>{price}</td>
							<td>{perfScore}</td>
							<td>{rating !== undefined ? rating : "-"}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default DeviceTable;
