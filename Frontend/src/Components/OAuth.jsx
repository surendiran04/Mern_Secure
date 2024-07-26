import React from "react";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";
const { VITE_BACKEND_URL } = import.meta.env;

function OAuth() {

  const handleGoogleLogin = (event) => {
    event.preventDefault();
    window.location.href = `${VITE_BACKEND_URL}/auth/google`
  };


  return (
    <button
      className="w-3/4  ml-12
        border-solid
         font-semibold hover:text-white  py-1 border hover:border-transparent transition duration-500 outline-none bg-transparent border-purple-500 hover:bg-purple-500 text-purple-700"

         onClick={handleGoogleLogin}
    >
      <div class="flex items-center">
        <IconContext.Provider value={{ className: "h-8 w-20 mt-1 ml-14" }}>
          <div>
            <FcGoogle />
          </div>
        </IconContext.Provider>
        Sign in with Google
      </div>
    </button>
  );
}

export default OAuth;
