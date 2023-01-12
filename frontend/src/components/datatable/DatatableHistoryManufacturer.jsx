import "./datatablehistory.scss";

import Modal, { ModalBody, ModalFooter, ModalHeader } from "../modal/Modal";
import { useEffect, useState } from "react";

import Button from "../button/Button";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {historyColumns} from '../../datatablehistorysource.js';

import {sanitize} from '../../utils/form-helpers.js';
import * as fetcher from "../../fetch/fetch-product-batch";

const DatatableHistoryManufacturer = () => {
	const [showModal, setShowModal] = useState(false);
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [items, setItems] = useState([]);

	const [query, setQuery] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const batchID = sanitize(query);
				const url = `http://localhost:8000/manufacturer/productBatch/history/${batchID}`;
				const result = await fetcher.fetchGetProductBatchHistory(url);
				
				setIsLoaded(true);
				setItems(result);
			}
			catch {
				setIsLoaded(true);
				setItems([]);
			}
		}

		fetchData();
	}, [query]);

	if (error) {
		return <>{error.message}</>;
	} else if (!isLoaded) {
		return <>Loading...</>;
	} else {
		return (
			<div className="datatablehistory">
				<div className="datatablehistoryTitle">
					List of History of Product Batch of Manufacturer
					<div className="search">
						{/* <input type="text" placeholder="Search ID..." /> */}
						<Button onClick={() => setShowModal(true)}>
							<SearchOutlinedIcon />
						</Button>
						<Modal show={showModal} setShow={setShowModal}>
							<ModalHeader>
								<h2>
									Search
									<input
										type="text"
										placeholder="Search ID..."
										value={query}
										onChange={(e) => setQuery(e.target.value)}
									/>
								</h2>
							</ModalHeader>
							<ModalBody>
								<DataGrid
									className="datagrid"
									rows={items}
									getRowId={row => row.timestamp}
									columns={historyColumns}
									pageSize={5}
									rowsPerPageOptions={[5]}
								/>
							</ModalBody>
							<ModalFooter>
								<Button onClick={() => setShowModal(false)}>Close</Button>
							</ModalFooter>
						</Modal>
					</div>
				</div>
			</div>
		);
	}
};

export default DatatableHistoryManufacturer;
