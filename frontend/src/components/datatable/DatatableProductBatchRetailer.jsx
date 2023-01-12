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

const DatatableProductBatchRetailer = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const url = 'http://localhost:8000/retailer-unit/productBatch/query/all';
			const result = await fetcher.fetchGetAllProductBatches(url);
			setData(result)
		}

		fetchData();
	}, []);

	const handleAddProduct = async (id) => {
		const productID = window.prompt("Enter a product ID to add: ", "");

		if(productID) {
			const quantity = window.prompt("Enter the quantity: ", "1");
			if(quantity) {
				let inputs = {
					batchID: id,
					productID: productID,
					quantity: quantity
				};
	
				const url = `http://localhost:8000/retailer-unit/productBatch/add-product`;
				const success = await fetcher.fetchAddProductsToBatch(url, inputs);
	
				if(success) {
					window.alert(`${quantity} product${quantity > 1 ? 's' : ''} ${productID} added to product batch ${id} sucessfully`);
					window.location.reload();
				}
				else {
					window.alert(`Failed to add ${quantity} product${quantity > 1 ? 's' : ''} ${productID} to product batch ${id}`);
				}
			}

		}
	};

	const actionColumn = [
		{
			field: "action",
			headerName: "Action",
			width: 160,
			renderCell: (params) => {
				return (
					<div className="cellAction">
						<div
							className="viewButton"
							onClick={async () => await handleAddProduct(params.row.id)}>
							Add Product
						</div>
					</div>
				);
			},
		},
	];
	return (
		<div className="datatableproductbatch">
			<div className="datatableproductbatchTitle">
				List of Product Batches
				<Link to="/retailer/newproductbatch" className="link">
					Purchase Product
				</Link>
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

export default DatatableProductBatchRetailer;
