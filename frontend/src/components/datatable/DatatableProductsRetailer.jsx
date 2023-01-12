import "./datatableproduct.scss";

import { productColumns, productRows } from "../../datatableproductsource";

import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useEffect, useState } from "react";

import * as fetcher from "../../fetch/fetch-product";

const DatatableProductsRetailer = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const url = 'http://localhost:8000/retailer-unit/product/all/available';
			const result = await fetcher.fetchGetAllProducts(url);
			setData(result)
		}

		fetchData();
	}, []);

	/*
	const statusColumn = [
		{
			field: "status",
			headerName: "Status",
			width: 160,
			renderCell: (params) => {
				return (
					<div>
						<div className="cellWithStatus">
							<span
								className={`status ${params.row.status} `}>
								{params.row.status}
							</span>
						</div>
					</div>
				);
			},
		},
	];
	*/

	return (
		<div className="datatableproduct">
			<div className="datatableproductTitle">Available Products</div>
			<DataGrid
				className="datagrid"
				rows={data}
				columns={productColumns.filter(column => column.field !== 'available')}
				pageSize={5}
				rowsPerPageOptions={[5]}
				//checkboxSelection
			/>
		</div>
	);
};

export default DatatableProductsRetailer;
