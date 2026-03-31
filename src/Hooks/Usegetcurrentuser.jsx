import { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setUserData } from "../pages/redux/User";
import { serverurl } from "../App";


const useGetCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchCurrentUser = async () => {
    try {
      
      const res = await axios.get(`${serverurl}/user/getcurrent`, {
        withCredentials: true,
      });

      if (res.data?.success) {
        setUser(res?.data?.currentUser);          // ✅ update local state
        dispatch(setUserData(res.data.currentUser)); // ✅ update redux
      } else {
        setError("Failed to fetch user");
      }
    }  catch (err) {
  console.error("🔥 GET CURRENT USER ERROR 🔥");

  console.error("Message:", err.message);
  console.error("Response:", err.response);
  console.error("Response data:", err.response?.data);
  console.error("Status:", err.response?.status);
  console.error("Headers:", err.response?.headers);

  setError(err.response?.data?.message || err.message);
}
 finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return { user, loading, error, refetch: fetchCurrentUser };
};

export default useGetCurrentUser;
