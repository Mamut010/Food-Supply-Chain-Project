import "./datatableproductbatch.scss";

import {
	productbatchColumns,
	productbatchRows,
} from "../../datatableproductbatchsource";

import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";

import * as fetcher from "../../fetch/fetch-product-batch";

const DatatableProductBatchDistributor = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const url = 'http://localhost:8000/distributor/productBatch/query/all';
			const result = await fetcher.fetchGetAllProductBatches(url);
			setData(result)
		}

		fetchData();
	}, []);

	const handleUpdateLocation = async (id) => {
		const newLocation = window.prompt("Enter new location: ", "");

		if(newLocation) {
			let inputs = {
				batchID: id,
				newLocation: newLocation,
			};

			const url = `http://localhost:8000/distributor/productBatch/location/${id}/update`;
			const success = await fetcher.fetchUpdateProductBatchLocation(url, inputs);

			if(success) {
				window.alert(`Location of Product Batch ${id} updated successfully`);
				window.location.reload();
			}
		}
	};

	const handleMarkAsDelivered = async (id) => {
		const url = `http://localhost:8000/distributor//productBatch/${id}/mark-delivered`;
		const success = await fetcher.fetchMarkBatchAsDelivered(url, id);

		if(success) {
			setData(() => {
				let i = data.findIndex(element => element.id === id);
				data[i].status = 'Delivered';
				return data;
			});
			window.alert(`Product batch ${id} successfully marked as delivered`);
		}
	};

	const actionColumn = [
		{
			field: "action",
			headerName: "Action",
			width: 300,
			renderCell: (params) => {
				return (
					<div className="cellAction">
						<div
							className="viewButton"
							onClick={async () => await handleUpdateLocation(params.row.id)}>
							Update Location
						</div>
						<div
							className="deleteButton"
							onClick={async () => await handleMarkAsDelivered(params.row.id)}>
							Mark As Delivered
						</div>
					</div>
				);
			},
		},
	];
	return (
		<div className="datatableproductbatch">
			<div className="datatableproductbatchTitle">
				List of Product Batch Of Distributor
			</div>
			<DataGrid
				className="datagrid"
				rows={data}
				columns={productbatchColumns.concat(actionColumn)}
				pageSize={5}
				rowsPerPageOptions={[5]}
				//checkboxSelection
			/>
		</div>
	);
};

export default DatatableProductBatchDistributor;
