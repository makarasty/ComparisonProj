export async function fetchExternalDevices(): Promise<any[]> {
	// FIXME
	return Promise.resolve([
		{
			name: "External GPU 1",
			category: "graphics-card",
			brand: "BrandX",
			specifications: { price: 400, performanceScore: 80 },
			rating: 4.2,
		},
		{
			name: "External TV 1",
			category: "tv",
			brand: "BrandY",
			specifications: { price: 900, screenSize: 55, resolution: "4K" },
			rating: 4.6,
		},
		{
			name: "My Great Sofa",
			category: "sofa",
			brand: "SofaBrand",
			specifications: { color: "blue", seats: 3, material: "leather" },
			rating: 4.3,
		},
		{
			name: "Large Refrigerator",
			category: "fridge",
			brand: "FridgeCo",
			specifications: { capacity: "350L", energyClass: "A++" },
			rating: 4.5,
		},
		{
			name: "My TV",
			category: "tv",
			brand: "Samsung",
			specifications: {
				price: 500,
				size: 55,
				resolution: "4K",
			},
			rating: 4.5,
		},
	]);
}
