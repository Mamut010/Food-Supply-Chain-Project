import "./new.scss";

//import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import NavbarManufacturer from "../../components/navbar/NavbarManufacturer";
import React from "react";
import SidebarManufacturer from "../../components/sidebar/SidebarManufacturer";
import { useState } from "react";
import { Link } from "react-router-dom";

import * as fetcher from "../../fetch/fetch-product";
import { readFormInputsAsJson } from "../../utils/form-helpers";

const handleCreateSubmit = async (event) => {
	event.preventDefault();

	const targetForm = document.getElementById('productCreateForm');

	const jsonInput = readFormInputsAsJson(targetForm);

	const fetchURL = `http://localhost:8000/manufacturer/product/available/create`;

	const success = await fetcher.fetchCreateProduct(fetchURL, jsonInput);

	if(success) {
		console.log("Product created successfully..");
	}

	window.location.href = "/manufacturer";
};

const NewManufacturerProducts = ({ inputs, title }) => {
	const [file, setFile] = useState("");
	return (
		<div className="new">
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

							<a href="/manufacturer" onClick={async (event) => await handleCreateSubmit(event)}>
								<button type="button">Send</button>
							</a>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewManufacturerProducts;
