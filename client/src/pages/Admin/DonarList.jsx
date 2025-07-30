import React, { useEffect, useState } from "react";
import API from "../../services/API";
import Layout from "../../components/shared/Layout/Layout";
import TableForAdmin from "../../components/shared/tables/TableForAdmin";

const DonarList = () => {
  const [data, setData] = useState([]);
  const getDonarData = async (req, res) => {
    try {
      const { data } = await API.get("/admin/donar-list");
      if (data?.success) {
        setData(data.donarData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDonarData();
  }, []);
  return (
    <>
      <Layout>
        <TableForAdmin data={data} list={"Donar List"} />
      </Layout>
    </>
  );
};

export default DonarList;
