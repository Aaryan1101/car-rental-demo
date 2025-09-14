import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.js";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // 🔹 Function to check if user is logged in
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // 🔹 Function to fetch all cars
  const fetchCars = async () => {
    try {
      const { data } = await api.get("/api/user/cars");
      data.success
        ? setCars(data.cars)
        : toast.error(data.message || "Failed to fetch cars");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // 🔹 Function to log out user
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    api.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged out");
  };

  // 🔹 UseEffect to retrieve token from localStorage and set up auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Set the token state
      setToken(token);
      
      // Set the authorization header for all subsequent API calls
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Fetch both user data and cars
      const initializeApp = async () => {
        try {
          const [userResponse, carsResponse] = await Promise.all([
            api.get("/api/user/data"),
            api.get("/api/user/cars")
          ]);

          if (userResponse.data.success) {
            setUser(userResponse.data.user);
            setIsOwner(userResponse.data.user.role === "owner");
          }

          if (carsResponse.data.success) {
            setCars(carsResponse.data.cars);
          }
        } catch (error) {
          console.error('Initialization error:', error);
          if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            setIsOwner(false);
          }
        }
      };

      initializeApp();
    }
  }, [token]);

  // 🔹 UseEffect to fetch user data when token is available
  // useEffect(() => {
  //   if (token) {
  //     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //     fetchUser();
  //   }
  // }, [token]);

  // 🔹 Value passed to context
  const value = {
    navigate,
    currency,
    api,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
