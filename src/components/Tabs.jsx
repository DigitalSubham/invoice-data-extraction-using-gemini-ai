import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTab } from "../redux/dataSlice";

const Tabs = () => {
  const tabsList = [
    { title: "customer", id: 0, value: "customer" },
    { title: "product", id: 1, value: "product" },
    { title: "invoice", id: 2, value: "invoice" },
  ];
  const dispatch = useDispatch();
  const { currentTab } = useSelector((store) => store.data);

  return (
    <div>
      <div className="flex gap-4 justify-center">
        {tabsList?.map((tab) => (
          <div
            className={`p-2 shadow-md rounded-md m-2 capitalize cursor-pointer ${
              currentTab === tab.value && "bg-green-500 text-white"
            }`}
            key={tab.id}
            onClick={() => dispatch(setCurrentTab(tab.value))}
          >
            {tab.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
