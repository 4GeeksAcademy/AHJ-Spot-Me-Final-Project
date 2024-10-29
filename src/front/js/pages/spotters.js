import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { SpotterCard } from "../component/spotterCard";
import { Context } from "../store/appContext";

export const Spotters = () => {
	const { store, actions } = useContext(Context);
	const [prefDistance, setPrefDistance]=useState(25)
	const [prefGenders, setPrefGender]= useState(["male","female","others"])
	return (
		<div className="container">
			<div>
				<h1>Filter Your Results</h1>
				<div>
					<h5>Gender</h5>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked />
						<label class="form-check-label" for="flexCheckDefault">
							Male
						</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
						<label class="form-check-label" for="flexCheckChecked">
							Female
						</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
						<label class="form-check-label" for="flexCheckChecked">
							Other
						</label>
					</div>
				</div>
				<div>
					<h5>Distance</h5>
					<label for="customRange2" class="form-label">Miles</label>
					<input type="range" class="form-range" min="0" max="25" id="customRange2" step="0.5"></input>
				</div>
			</div>
			{store.users.map((spotter, index) => {
				return (<SpotterCard spotter={spotter} />)
			})}
		</div>
	);
};
