import "./datatableproductbatch.scss";

import { productbatchColumns, productbatchRows } from "../../datatableproductbatchsource";

import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";

import * as fetcher from "../../fetch/fetch-product";

const DatatableProductBatch = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const url = 'http://localhost:8000/manufacturer/product/query/products/all';
			const result = await fetcher.fetchGetAllProducts(url);
			setData(result)
		}

		fetchData();
	  }, []);

	const handleDelete = async (id) => {
		const url = `http://localhost:8000/manufacturer/product/${id}/delete`;
		const success = await fetcher.fetchDeleteProduct(url, id);

		if(success) {
			setData(data.filter((item) => item.id !== id));
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
						<Link to="/productbatch/test" style={{ textDecoration: "none" }}>
							<div className="viewButton">View</div>
						</Link>
						<div
							className="deleteButton"
							onClick={() => handleDelete(params.row.id)}>
							Delete
						</div>
					</div>
				);
			},
		},
	];
	return (
		<div className="datatableproductbatch">
			<div className="datatableproductbatchTitle">List of Product Batch</div>
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

export default DatatableProductBatch;
