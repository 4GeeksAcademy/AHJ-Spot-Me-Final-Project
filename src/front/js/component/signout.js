const handleSignOut = async (navigate) => {
    try {
        const response = await fetch("http://localhost:5000/api/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            localStorage.removeItem("token"); // Clear token from local storage
            navigate("/login"); // Redirect to login page
        } else {
            console.error("Failed to log out");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
};

export default handleSignOut;
