import "./newretailerproductbatch.scss";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React from "react";
import { useState } from "react";
import SidebarRetailer from "../../components/sidebar/SidebarRetailer";
import NavbarRetailer from "../../components/navbar/NavbarRetailer";

import * as fetcher from "../../fetch/fetch-product-batch";
import { readFormInputsAsJson } from "../../utils/form-helpers";

const handleFormSubmit = async (event) => {
	event.preventDefault();

	const targetForm = document.getElementById('purchaseProductForm');

	const jsonInput = readFormInputsAsJson(targetForm);

	const url = `http://localhost:8000/retailer-unit/product/purchase`;

	const success = await fetcher.fetchPurchaseProduct(url, jsonInput);

	if(success) {
		window.alert("Product batch created successfully..");
		window.location.href = "/retailer/productbatch";
	}
	else {
		window.alert("Failed to create a product batch..");
	}
};

const NewRetailerProductBatch = ({ inputs, title }) => {
	const [file, setFile] = useState("");
	return (
		<div className="newretailerproductbatch">
			<SidebarRetailer />
			<div className="newContainer">
				<NavbarRetailer />
				<div className="top">
					<h1>{title}</h1>
				</div>
				<div className="bottom">
					<div className="left">
						<img
							src={
								file
									? URL.createObjectURL(file)
									: "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
							}
							alt=""
						/>
					</div>
					<div className="right">
						<form id="purchaseProductForm">
							{inputs.map((input) => (
								<div className="formInput" key={input.id}>
									<label>{input.label}</label>
									<input type={input.type} placeholder={input.placeholder} name={input.name} required/>
								</div>
							))}

							<a href="/retailer/productbatch" onClick={async (event) => await handleFormSubmit(event)}>
								<button type="button">Send</button>
							</a>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewRetailerProductBatch;
