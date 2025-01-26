import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { CssBaseline } from "@mui/material";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<CssBaseline />
		<App />
	</React.StrictMode>,
);
