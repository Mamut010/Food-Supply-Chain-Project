import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import React from "react";
import {render} from 'react-dom'

const root = document.getElementById('root')
render(
	<React.StrictMode>
		<DarkModeContextProvider>
			<App />
		</DarkModeContextProvider>
	</React.StrictMode>,
	root
);
