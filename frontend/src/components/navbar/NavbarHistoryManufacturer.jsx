import "./navbarhistorymanufacturer.scss";

import { DarkModeContext } from "../../context/darkModeContext";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { Link } from "react-router-dom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import React from "react";
import StoreMallDirectoryOutlinedIcon from "@mui/icons-material/StoreMallDirectoryOutlined";
import { useContext } from "react";

const NavbarHistoryManufacturer = () => {
	const { dispatch } = useContext(DarkModeContext);
	return (
		<div className="navbarhistorymanufacturer">
			<div className="wrapper">
				<div className="items">
					<div className="item">
						<LanguageOutlinedIcon className="icon" />
						English
					</div>
					<div className="item">
						<DarkModeOutlinedIcon
							className="icon"
							onClick={() => dispatch({ type: "TOGGLE" })}
						/>
					</div>
					<div className="item">
						<Link to="/distributor" style={{ textDecoration: "none" }}>
							<LocalShippingOutlinedIcon className="icon" />
						</Link>
					</div>
					<div className="item">
						<Link to="/retailer" style={{ textDecoration: "none" }}>
							<StoreMallDirectoryOutlinedIcon className="icon" />
						</Link>
					</div>
					<div className="item">
						<img
							src="https://scontent.fsgn5-3.fna.fbcdn.net/v/t1.6435-9/173463578_275185090929068_8429540102837669665_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=174925&_nc_ohc=Uauq0LvG9KgAX-dhvDv&tn=hU6u8CV6-pczBTFY&_nc_ht=scontent.fsgn5-3.fna&oh=00_AT9aNjdbfC4bbL5b_SKaBOoMvMEd7koqbjj5NsQ_JSQSmA&oe=637A9912"
							alt=""
							className="avatar"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NavbarHistoryManufacturer;
