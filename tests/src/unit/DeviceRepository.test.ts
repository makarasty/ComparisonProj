import DeviceRepository from "@server/repositories/DeviceRepository";
import DeviceModel from "@server/models/DeviceModel";
import { IProduct } from "@server/interfaces/Product";

// Мокаем модель
jest.mock("@server/models/DeviceModel");

describe("DeviceRepository - Unit tests", () => {
	const mockDevice: IProduct = {
		//@ts-expect-error
		_id: "mock-id",
		uuid: 12345,
		title: "Mock Device",
		description: "Some description",
		price: 9.99,
		brand: "MockBrand",
		category: "MockCategory",
		image: "/images/unknown.jpg",
		images: [],
		rating: 4,
		stock: 10,
		available: true,
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("findAll() should return an array of devices", async () => {
		(DeviceModel.find as jest.Mock).mockReturnValue({
			sort: jest.fn().mockReturnValue({
				exec: jest.fn().mockResolvedValue([mockDevice]),
			}),
		});

		const result = await DeviceRepository.findAll();
		expect(result).toHaveLength(1);
		expect(result[0].title).toBe("Mock Device");
	});

	it("findById() should return a device", async () => {
		(DeviceModel.findById as jest.Mock).mockReturnValue({
			exec: jest.fn().mockResolvedValue(mockDevice),
		});

		const result = await DeviceRepository.findById("mock-id");
		expect(result?.title).toBe("Mock Device");
	});

	it("create() should create and save a device", async () => {
		(DeviceModel as jest.MockedFunction<any>).mockImplementation(() => ({
			save: jest.fn().mockResolvedValue(mockDevice),
		}));

		const created = await DeviceRepository.create(mockDevice);
		//@ts-expect-error
		expect(created._id).toBe("mock-id");
		expect(DeviceModel).toHaveBeenCalledWith(mockDevice);
	});

	it("update() should return updated device", async () => {
		(DeviceModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
			exec: jest.fn().mockResolvedValue({ ...mockDevice, title: "Updated" }),
		});

		const result = await DeviceRepository.update("mock-id", {
			title: "Updated",
		});
		expect(result?.title).toBe("Updated");
	});

	it("delete() should delete a device", async () => {
		(DeviceModel.findByIdAndDelete as jest.Mock).mockReturnValue({
			exec: jest.fn().mockResolvedValue(mockDevice),
		});

		const result = await DeviceRepository.delete("mock-id");
		expect(result?.title).toBe("Mock Device");
	});
});
