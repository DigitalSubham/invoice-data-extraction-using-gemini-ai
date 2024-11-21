import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TableRow from "./TableRow";
import TableHead from "./TableHead";
import EditModal from "./EditModal";

const Table = () => {
  const { currentTab, dataSet } = useSelector((store) => store.data);

  const [headData, setHeadData] = useState([]);
  const [bodyData, setBodyData] = useState([]);

  console.log("dataSet", dataSet);

  useEffect(() => {
    if (dataSet && currentTab) {
      // Ensure both dataSet and currentTab are defined
      const current = Object.keys(dataSet).find((data) =>
        data.toLowerCase().includes(currentTab)
      );
      if (current) {
        const dataFound = dataSet[current];
        if (Array.isArray(dataFound)) {
          setHeadData(Object.keys(dataFound[0]));
          setBodyData(dataFound);
        } else {
          setHeadData(Object.keys(dataFound));
          setBodyData([dataFound]);
        }
      }
    }
  }, [currentTab, dataSet]);

  console.log("bod", bodyData);

  return (
    <>
      {dataSet && Object.keys(dataSet).length > 0 && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[80%] h-[80%] mt-7 mx-auto">
          <table className="w-full h-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
            <TableHead
              calledBy="parent"
              headData={headData}
              currentTab={currentTab}
            />
            <tbody>
              {bodyData &&
                bodyData.length > 0 &&
                bodyData.map((row, index) => (
                  <TableRow
                    key={index}
                    bodyData={row}
                    currentTab={currentTab}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Table;
