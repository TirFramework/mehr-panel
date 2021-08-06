import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import * as api from "../api";

const useSidebar = () => {
  return useQuery("sidebar", api.getSidebar);
};




const useCols = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getCols().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);


	return {data , loading}
};




export { useSidebar, useCols };
