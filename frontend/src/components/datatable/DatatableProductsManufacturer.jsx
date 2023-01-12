import "./datatableproduct.scss";

import { productColumns, productRows } from "../../datatableproductsource";

import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { EditProductManufacturer } from "../../pages/edit/EditProductManufacturer";
import { Button } from "react-bootstrap";

import * as fetcher from "../../fetch/fetch-product";

const DatatableProductsManufacturer = () => {
	//const [data, setData] = useState(productRows);
	const [data, setData] = useState([]);

	// 3. Create our useEffect function
	useEffect(() => {
		const fetchData = async () => {
			const url = 'http://localhost:8000/manufacturer/product/query/products/all';
			const result = await fetcher.fetchGetAllProducts(url);
			setData(result)
		}

		fetchData();
	  }, []);

	const handleMarkAvailable = async (id) => {
		const url = `http://localhost:8000/manufacturer/product/mark/available`;
		const success = await fetcher.fetchMarkAsAvailable(url, id);

		if(success) {
			setData(() => {
				let i = data.findIndex(element => element.id === id);
				data[i].available = true;
				return data;
			});
			window.alert(`Product ${id} successfully marked as available`);
		}
	}

	const handleMarkUnavailable = async (id) => {
		const url = `http://localhost:8000/manufacturer/product/mark/unavailable`;
		const success = await fetcher.fetchMarkAsUnavailable(url, id);

		if(success) {
			setData(() => {
				let i = data.findIndex(element => element.id === id);
				data[i].available = false;
				return data;
			});
			window.alert(`Product ${id} successfully marked as unavailable`);
		}
	}

	const handleDelete = async (id) => {
		const url = `http://localhost:8000/manufacturer/product/${id}/delete`;
		const success = await fetcher.fetchDeleteProduct(url, id);

		if(success) {
			setData(data.filter((item) => item.id !== id));
			window.alert(`Product ${id} deleted successfully`);
		}
	};

/*
const handleEdit = (
		id,
		product,
		category,
		origin,
		price,
		measurement,
		quantity,
		productionDate,
		expirationDate,
		available
) => {
		setData(data.map((item) => item.id === id));
		setData(data.map((item) => item.product === product));
		setData(data.map((item) => item.category === category));
		setData(data.map((item) => item.origin === origin));
		setData(data.map((item) => item.price === price));
		setData(data.map((item) => item.measurement === measurement));
		setData(data.map((item) => item.quantity === quantity));
		setData(data.map((item) => item.productionDate === productionDate));
		setData(data.map((item) => item.expirationDate === expirationDate));
		setData(data.map((item) => item.quantity === available));
	};
*/

	const actionColumn = [
		{
			field: "action",
			headerName: "Action",
			width: 300,
			renderCell: (params) => {
				return (
					<div className="cellAction">
						<div
							className="editButton"
							onClick={() => handleMarkAvailable(params.row.id) }>
							Mark Available
						</div>
						<div
							className="deleteButton"
							onClick={() => handleMarkUnavailable(params.row.id) }>
							Mark Unavailable
						</div>
					</div>
				);
			},
		},
	];

	const deleteColumn = [
		{
			field: "delete",
			headerName: "Extra",
			width: 130,
			renderCell: (params) => {
				return (
					<div className="cellAction">
						<div
							className="deleteButton"
							onClick={async () => await handleDelete(params.row.id)}>
							Delete
						</div>
					</div>
				);
			},
		},	
	]

	return (
		<div className="datatableproduct">
			<div className="datatableproductTitle">
				List of Products
				<Link to="/manufacturer/newproduct" className="link">
					Create New Product
				</Link>
			</div>
			<DataGrid
				className="datagrid"
				rows={data}
				columns={productColumns.concat(actionColumn).concat(deleteColumn)}
				pageSize={5}
				rowsPerPageOptions={[5]}
				//checkboxSelection
			/>
		</div>
	);
};

export default DatatableProductsManufacturer;
