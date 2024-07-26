import React from "react";
import { LogOut } from "lucide-react";
import { useAuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const { user,setLoggedIn } = useAuthContext();

  const navigate = useNavigate();

  const Logout = ()=>{
    sessionStorage.removeItem('_tk');
    sessionStorage.removeItem('user');
    setLoggedIn(false)
    navigate('/');
  }
  
  return (
    <div>
      <div className=" flex items-center justify-center h-screen bg-gray-800">
        <div className="bg-white  shadow-md p-6 w-1/2 rounded-xl">
          <div className="p-4 text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to MERN Secure App</h1>
            <p className="text-gray-600 py-5">
              <h5>UserName: {user.Name}</h5>
              <h5>Email: {user.email}</h5>
            </p>
            <button className="mt-4 bg-blue-500 ml-72 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex" onClick={Logout}>
              <LogOut />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
