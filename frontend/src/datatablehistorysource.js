export const historyColumns = [
	{ field: "id", headerName: "Batch ID", width: 100 },
	{
		field: "product-list",
		headerName: "Products",
		width: 120,
	},
	{
		field: "manufacturerid",
		headerName: "Manufacturer ID",
		width: 200,
	},

	{
		field: "distributorid",
		headerName: "Distributor ID",
		width: 200,
	},

	{
		field: "retailerid",
		headerName: "Retailer ID",
		width: 200,
	},

	{
		field: "destination",
		headerName: "Destination",
		width: 180,
	},

	{
		field: "currentLocation",
		headerName: "Current Location",
		width: 180,
	},

	{
		field: "ArrivalTimestamp",
		headerName: "Arrival Timestamp",
		width: 160,
	},
	{
		field: "status",
		headerName: "Status",
		width: 160,
	},

	{
		field: "date",
		headerName: "Date modified",
		width: 160,
	},
];

//temporary data
export const historyRows = [
	{
		id: "ID1",
		products: "Acer Nitro 5",
		manufacturerID: "ID1",
		distributorID: "ID2",
		retailerID: "ID3",
		currentLocation: "VietNam",
		destination: "USA",
		ArrivalTimestamp: "1/10/2021",
		status: "Approved",
	},

	{
		id: "ID2",
		products: "Playstation 5",
		manufacturerID: "ID1",
		distributorID: "ID2",
		retailerID: "ID3",
		currentLocation: "Canada",
		destination: "Australia",
		ArrivalTimestamp: "21/7/2022",
		status: "Pending",
	},

	{
		id: "ID3",
		products: "Redragon S101",
		manufacturerID: "ID1",
		distributorID: "ID2",
		retailerID: "ID3",
		currentLocation: "Brazil",
		destination: "UK",
		ArrivalTimestamp: "13/4/2021",
		status: "Denied",
	},

	{
		id: "ID4",
		products: "Razer Blade 15",
		manufacturerID: "ID1",
		distributorID: "ID2",
		retailerID: "ID3",
		currentLocation: "German",
		destination: "Italy",
		ArrivalTimestamp: "15/4/2020",
		status: "Pending",
	},

	{
		id: "ID5",
		products: "ASUS ROG Strix",
		manufacturerID: "ID1",
		distributorID: "ID2",
		retailerID: "ID3",
		currentLocation: "France",
		destination: "Dubai",
		ArrivalTimestamp: "17/9/2018",
		status: "Approved",
	},
];
