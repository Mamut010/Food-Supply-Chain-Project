import "./list.scss";

import DatatableHistoryManufacturer from "../../components/datatable/DatatableHistoryManufacturer";
import { Link } from "react-router-dom";
import NavbarHistoryManufacturer from "../../components/navbar/NavbarHistoryManufacturer";
import React from "react";
import SidebarManufacturer from "../../components/sidebar/SidebarManufacturer";

const Listhistorymanufacturer = () => {
	return (
		<div className="list">
			<SidebarManufacturer />
			<div className="listContainer">
				<NavbarHistoryManufacturer />
				<Link
					to="/manufacturer/history"
					style={{ textDecoration: "none" }}>
					<DatatableHistoryManufacturer />
				</Link>
			</div>
		</div>
	);
};

export default Listhistorymanufacturer;
