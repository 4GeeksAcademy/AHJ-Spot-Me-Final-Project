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
				
			}
		}
	};
};

export default getState;
