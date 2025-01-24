import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ComparePage from "./pages/ComparePage";

const App: React.FC = () => {
	return (
		<div>
			<nav>
				<Link to="/">Home</Link>
				<Link to="/compare">Compare</Link>
			</nav>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/compare" element={<ComparePage />} />
			</Routes>
		</div>
	);
};

export default App;
