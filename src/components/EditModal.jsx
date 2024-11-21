import React, { useState } from "react";
import Modal from "./Modal";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { setEditDataAll } from "../redux/dataSlice";

const EditModal = ({ dataEdit, onClose, setEditModal }) => {
  const [isEditable, setIsEditable] = useState(false);
  const { currentTab } = useSelector((store) => store.data);
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(
      setEditDataAll({
        data: data,
        currentTab,
        id: dataEdit.uniqueId,
      })
    );
    onClose();
  };

  const handleOnChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Modal onClose={onClose}>
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        {/* <!-- Modal header --> */}
        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit User
          </h3>
          {currentTab !== "invoice" && (
            <button
              type="button"
              onClick={() => setIsEditable(!isEditable)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <CiEdit size={30} />
            </button>
          )}
        </div>
        {/* <!-- Modal body --> */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-6 gap-6">
            {Object.entries(dataEdit).map(([key, value], index) => (
              <>
                {key !== "uniqueId" && (
                  <div key={index} className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor={key}
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
                    >
                      {key.replace(/([A-Z])/g, " $1")}{" "}
                    </label>
                    <input
                      type="text"
                      readOnly={!isEditable}
                      onChange={handleOnChange}
                      name={key}
                      id={key}
                      defaultValue={value}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>

        <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
          {isEditable && (
            <button
              onClick={handleSave}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
