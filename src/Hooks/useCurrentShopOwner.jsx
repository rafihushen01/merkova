import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { serverurl } from "../App";
import { setShopData } from "../pages/redux/Shop";

const useCurrentShopOwner = (enabled = true) => {
  const [loading, setLoading] = useState(true);
  const [hasShop, setHasShop] = useState(false);
  const [shop, setShop] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setHasShop(false);
      setShop(null);
      return;
    }

    let isMounted = true;

    const fetchShop = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${serverurl}/shop/getcurrentshop`, {
          withCredentials: true,
        });

        if (!isMounted) {
          return;
        }

        if (res?.data?.success === true && res?.data?.hasShop === true) {
          setHasShop(true);
          setShop(res.data.shop);
          dispatch(setShopData(res.data.shop));
        } else {
          setHasShop(false);
          setShop(null);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const statusCode = error?.response?.status;
        const responseData = error?.response?.data;
        const backendMessage =
          responseData?.message ||
          responseData?.error ||
          responseData?.reason ||
          responseData?.details;
        const finalErrorMessage =
          backendMessage ||
          (error?.request && "No response from server") ||
          error?.message ||
          "Unknown error occurred";

        if (statusCode !== 401) {
          toast.error(
            typeof finalErrorMessage === "string"
              ? finalErrorMessage
              : "Something went wrong. Check console."
          );
        }

        setHasShop(false);
        setShop(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchShop();

    return () => {
      isMounted = false;
    };
  }, [dispatch, enabled]);

  return { loading, hasShop, shop };
};

export default useCurrentShopOwner;
