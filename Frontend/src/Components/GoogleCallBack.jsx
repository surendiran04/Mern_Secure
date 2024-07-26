import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GoogleCallback = () => {
  const { setLoggedIn, SetUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");

      if (token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/current_user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const text = await response.text();
          const data = JSON.parse(text);
          const user = data.user;
          SetUser(user);
          setLoggedIn(true);
          sessionStorage.setItem("_tk", data.token);
          toast.success(data.message);
          navigate("/dashboard");
        } catch (error) {
            toast.info( error);
            navigate("/");
        }
      } else {
        toast.info("something went wrong!");
      }
    };

    handleGoogleCallback();
  }, [navigate, setLoggedIn, SetUser]);

  return (
    <>
      <div>Loading...</div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </>
  );
};

export default GoogleCallback;
