const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			token: localStorage.getItem("token") || null,
			favorites: [],
			matches: [],
			likedUsers: [],
			message: null
		},
		actions: {
			// getAllUsers: () => {
			// 	fetch(process.env.BACKEND_URL + "/api/users")
			// 		.then(resp => resp.json())
			// 		.then(data => {
			// 			console.log(data)
			// 			setStore({ users: data.users })
			// 		})
			// 		.catch(error => console.log(error))

			// },
			getAllUsers: () => {
				const token = localStorage.getItem("token");
				fetch(process.env.BACKEND_URL + "/api/users", {
					headers: {
						"Authorization": `Bearer ${token}`,
						"Content-Type": "application/json"
					}
				})
					.then(resp => resp.json())
					.then(data => {
						console.log("User data:", data); // For debugging
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
				setStore({ token: data.access_token })
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
			getProfile: async () => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(process.env.BACKEND_URL + "/api/check-profile", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						return data;
					} else {
						console.log("Failed to fetch profile");
					}
				} catch (error) {
					console.error("Error fetching profile:", error);
				}
			},

			updateProfile: async (profileData) => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(process.env.BACKEND_URL + "/api/edit-profile", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify(profileData)
					});
					return response.ok;
				} catch (error) {
					console.error("Error updating profile:", error);
					return false;
				}
			},

			// Get all potential spotters (excluding already liked/matched users)
			getPotentialSpotters: async () => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(process.env.BACKEND_URL + "/api/potential-spotters", {
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});
					const data = await response.json();
					setStore({ users: data });
				} catch (error) {
					console.error("Error fetching spotters:", error);
				}
			},

			// Add user to favorites (create like)
			addToFavorites: async (userId) => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${process.env.BACKEND_URL}/api/like/${userId}`, {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});

					const data = await response.json();
					if (data.match_created) {
						// If it's a match, refresh matches list
						getActions().getMatches();
						return { success: true, isMatch: true };
					}
					return { success: true, isMatch: false };
				} catch (error) {
					console.error("Error adding to favorites:", error);
					return { success: false };
				}
			},

			removeFavorite: async (userId) => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${process.env.BACKEND_URL}/api/unlike/${userId}`, {
						method: "DELETE",
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});

					if (response.ok) {
						getActions().getLikedUsers();
						return true;
					}
					return false;
				} catch (error) {
					console.error("error removing favorite:", error);
					return false
				}
			},


			getLikedUsers: async () => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${process.env.BACKEND_URL}/api/liked-users`, {
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});
					const data = await response.json();
					setStore({ likedUsers: data });
				} catch (error) {
					console.error("Error fetching liked users:", error);
				}
			},

			// Get matches (mutual likes)
			getMatches: async () => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(process.env.BACKEND_URL + "/api/matches", {
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});
					const data = await response.json();
					setStore({ matches: data });
				} catch (error) {
					console.error("Error fetching matches:", error);
				}
			}


		}
	};
};

export default getState;
