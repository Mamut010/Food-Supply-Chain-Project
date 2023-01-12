import "./newmanufacturerproductbatch.scss";

//import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import NavbarManufacturer from "../../components/navbar/NavbarManufacturer";
import React from "react";
import SidebarManufacturer from "../../components/sidebar/SidebarManufacturer";
import { useState } from "react";

import * as fetcher from "../../fetch/fetch-product-batch";
import { readFormInputsAsJson } from "../../utils/form-helpers";

const handleCreateSubmit = async (event) => {
	event.preventDefault();

	const targetForm = document.getElementById('productCreateForm');

	const jsonInput = readFormInputsAsJson(targetForm);

	const createURL = `http://localhost:8000/manufacturer/productBatch/create`;
	const destintionURL = `http://localhost:8000/manufacturer/productBatch/destination/${jsonInput.batchID}/update`;

	const success = await fetcher.fetchCreateProductBatch(createURL, destintionURL, jsonInput);

	if(success) {
		console.log("Product batch created successfully..");
	}
	
	window.location.href = "/manufacturer/productbatch";
};

const NewManufacturerProductBatch = ({ inputs, title }) => {
	const [file, setFile] = useState("");
	return (
		<div className="newmanufacturerproductbatch">
			<SidebarManufacturer />
			<div className="newContainer">
				<NavbarManufacturer />
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
						<form id="productCreateForm">
							{inputs.map((input) => (
								<div className="formInput" key={input.id}>
									<label>{input.label}</label>
									<input type={input.type} placeholder={input.placeholder} name={input.name} required/>
								</div>
							))}

							<a href="/manufacturer/productbatch" onClick={async (event) => await handleCreateSubmit(event)}>
								<button type="button">Send</button>
							</a>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewManufacturerProductBatch;
