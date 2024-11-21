import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({
  children,
  onClose,
  progressBar = false,
  progressBarValue = 0,
  height,
}) => {
  const [progressValue, setProgressValue] = useState(progressBarValue);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    setProgressValue(progressBarValue);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [progressBarValue, onClose]);

  return (
    <div className="text-black fixed top-0 left-0 w-full h-full gap-2 flex justify-center items-center bg-gray-500 bg-opacity-80 z-50 ">
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg p-8 md:w-[50%] w-[90%] ${
          height ? "h-fit" : "h-[80%]"
        } overflow-y-auto shadow-lg transition-all duration-300 ease-in-out`}
      >
        {progressBar && (
          <div className="w-full flex items-center justify-center">
            <div className="w-[80%] flex items-center  bg-gray-200 rounded-full h-1">
              <div
                className={`bg-primary h-[3px] rounded-full transition-all duration-300 ease-in-out`}
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
        >
          <IoClose size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
