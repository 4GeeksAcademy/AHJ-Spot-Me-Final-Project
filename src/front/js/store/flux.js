const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: []
		},
		actions: {
			getAllUsers: ()=>{
				fetch(process.env.BACKEND_URL + "/api/users")
				.then(resp=>resp.json()) 
				.then(data=>{
					console.log(data)
					setStore({users:data.users})
				})
				.catch(error=>console.log(error))
				
			},
			login:async() => {
				let response=await fetch(process.env.BACKEND_URL+"/api/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password })
				})
				if (response.status != 200){
					let error = await response.json()
					console.log (error,response.status)
					return false
				}
				let data = await response.json()
				console.log (data)
				localStorage.setItem("token",data.access_token)
				return true
			}
		}
	};
};

export default getState;
