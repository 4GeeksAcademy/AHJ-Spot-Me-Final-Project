import React, { Component } from "react";

export const SpotterCard = ({spotter}) => {
    return (
        <div className="card" style={{width:"18rem"}}>
            <img src="..." className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{spotter.email}</h5>
                <p className="card-text">Gender: {spotter.gender}</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    )
}
