const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
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

			logOut: () => {
				localStorage.removeItem("token");
			}
		}
	};
};

export default getState;
