import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TableHead from "./TableHead";
import EditModal from "./EditModal";

const TableRow = ({ bodyData, currentTab }) => {
  const { dataSet } = useSelector((store) => store.data);
  const middleIndex = Math.floor(Object.keys(bodyData).length / 2);
  const [productInfo, setProductInfo] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [dataEdit, setDataEdit] = useState({});

  useEffect(() => {
    if (dataSet && currentTab) {
      const current = Object.keys(dataSet).find((key) =>
        key.toLowerCase().includes("product")
      );
      if (current) {
        const dataFound = dataSet[current];
        setProductInfo(
          Array.isArray(dataFound)
            ? dataFound.map(({ name, quantity }) => ({ name, quantity }))
            : [Object.values(dataFound)]
        );
      }
    }
  }, [dataSet, currentTab]);

  const renderBodyData = (data, index) => (
    <td key={index} className="px-6 py-4">
      {data || "NA"}
    </td>
  );

  const handleRowClick = (rowData) => {
    if (rowData && Object.keys(rowData).length > 0) {
      setDataEdit(rowData);
    }
    setEditModal(true);
  };

  const handleModalClose = () => {
    setEditModal(false);
  };

  // Filter out the data with the "uniqueId" key
  const filteredBodyData = Object.keys(bodyData)
    .filter((key) => key !== "uniqueId")
    .reduce((obj, key) => {
      obj[key] = bodyData[key];
      return obj;
    }, {});

  return (
    <>
      <tr
        onClick={() => handleRowClick(bodyData)}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        {Object.values(filteredBodyData)
          ?.slice(0, middleIndex)
          .map(renderBodyData)}

        {currentTab === "invoice" && productInfo.length > 0 && (
          <td colSpan={2}>
            <table className="text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400 w-full">
              <TableHead headData={["Name", "Quantity"]} />
              <tbody>
                {productInfo.map((product, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-100"
                  >
                    <td className="px-6 py-4">{product.name || "NA"}</td>
                    <td className="px-6 py-4">{product.quantity || "NA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        )}

        {Object.values(filteredBodyData)
          ?.slice(middleIndex)
          .map(renderBodyData)}
      </tr>
      {editModal && (
        <EditModal dataEdit={dataEdit} onClose={handleModalClose} />
      )}
    </>
  );
};

export default TableRow;
