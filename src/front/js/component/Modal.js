import React from "react";
import "../../styles/modal.css";

export const Modal = ({ title, message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onClose} className="btn btn-primary">
                    OK
                </button>
            </div>
        </div>
    );
};
