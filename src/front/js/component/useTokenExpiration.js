import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useTokenExpiration = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const tokenExpiration = parseInt(localStorage.getItem("tokenExpiration"), 10);
        if (!tokenExpiration) return;

        const currentTime = Date.now();
        const timeUntilExpiration = tokenExpiration - currentTime;

        // Show modal 1 minute before expiration
        if (timeUntilExpiration > 60000) {
            const modalTimeout = setTimeout(() => {
                setShowModal(true);
            }, timeUntilExpiration - 60000);

            // Clean up modal timeout
            return () => clearTimeout(modalTimeout);
        }

        // Automatically log out at expiration
        const logoutTimeout = setTimeout(() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("tokenExpiration");
            navigate("/login", { state: { expired: true } });
        }, timeUntilExpiration);

        // Clean up logout timeout
        return () => clearTimeout(logoutTimeout);
    }, [navigate]);

    return { showModal, setShowModal };
};

export default useTokenExpiration;
