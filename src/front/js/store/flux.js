const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			message: null
		},
		actions: {
			getAllUsers: () => {
				fetch(process.env.BACKEND_URL + "/api/users")
					.then(resp => resp.json())
					.then(data => {
						console.log(data)
						setStore({ users: data.users })
					})
					.catch(error => console.log(error))

			},
			signup: async (formData) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: formData.email.toLowerCase(),
							password: formData.password,
							full_name: formData.fullName,
							state: formData.state,
							city: formData.city
						})
					});
					const data = await response.json();

					if (response.status === 201) {
						return {
							success: true,
							message: "Signup successful! Please login to continue."
						};
					}

					return {
						success: false,
						message: data.error || "Signup failed"
					};
				} catch (error) {
					console.error("Signup error:", error);
					return {
						success: false,
						message: "An error occurred during signup"
					};
				}
			},

			login: async (email, password) => {
				let response = await fetch(process.env.BACKEND_URL + "/api/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(
						{
							email: email.toLowerCase(),
							password: password
						}
					)
				})
				if (response.status != 200) {
					let error = await response.json()
					console.log(error, response.status)
					return false
				}
				let data = await response.json()
				console.log(data)
				localStorage.setItem("token", data.access_token)
				return true
			},

			logout: async () => {
				try {
					const token = localStorage.getItem("token");
					if (!token) return true;

					const response = await fetch(process.env.BACKEND_URL + "/api/logout", {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});

					if (response.status === 200) {
						localStorage.removeItem("token");
						localStorage.removeItem("authToken");
						return true;
					}
					localStorage.removeItem("token");
					localStorage.removeItem("authToken");

					return false;
				} catch (error) {
					console.error("Logout error:", error);
					return false;
				}
			},
			forgotPassword: async (email) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/forgot-password`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email: email.toLowerCase() })
					});

					const data = await response.json();

					return {
						success: response.status === 200,
						message: data.message
					};
				} catch (error) {
					console.error("Forgot password error:", error);
					return {
						success: false,
						message: "An error occurred while processing your request"
					};
				}
			},

			resetPassword: async (token, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password/${token}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ password })
					});

					const data = await response.json();

					return {
						success: response.status === 200,
						message: data.message
					};
				} catch (error) {
					console.error("Reset password error:", error);
					return {
						success: false,
						message: "An error occurred while resetting your password"
					};
				}
			},

		}
	};
};

export default getState;
