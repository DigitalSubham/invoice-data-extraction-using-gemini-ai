import React from "react";

const TableHead = ({ headData, currentTab, calledBy }) => {
  const middleIndex = Math.floor(headData.length / 2);

  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {headData &&
          headData.slice(0, middleIndex).map(
            (data, index) =>
              data !== "uniqueId" && (
                <th key={index} scope="col" className="px-6 py-3">
                  {data.replace(/([A-Z])/g, " $1")}
                </th>
              )
          )}

        {currentTab && currentTab === "invoice" && (
          <>
            <th scope="col" className="px-6 py-3">
              Product
            </th>
          </>
        )}

        {headData &&
          headData.slice(middleIndex).map(
            (data, index) =>
              data !== "uniqueId" && (
                <th
                  colSpan={currentTab && currentTab === "invoice" ? "2" : "1"}
                  key={index + middleIndex}
                  scope="col"
                  className="px-6 py-3"
                >
                  {data.replace(/([A-Z])/g, " $1")}
                </th>
              )
          )}
      </tr>
    </thead>
  );
};

export default TableHead;
