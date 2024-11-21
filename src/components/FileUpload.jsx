import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Modal from "./Modal";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setDataForTable } from "../redux/dataSlice";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { prompt, prompt2, prompt3, prompt7 } from "../utils/prompt";

const convertExcelToPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const pdf = new jsPDF();

        workbook.SheetNames.forEach((sheetName, index) => {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Array of arrays

          if (index > 0) pdf.addPage(); // Add new page for each sheet

          rows.forEach((row, rowIndex) => {
            pdf.text(row.join(" "), 10, 10 + rowIndex * 10); // Simple row print
          });
        });

        // Convert PDF to Blob
        const pdfBlob = pdf.output("blob");
        const pdfFile = new File([pdfBlob], `${file.name.split(".")[0]}.pdf`, {
          type: "application/pdf",
        });

        resolve(pdfFile); // Return the generated PDF file
      } catch (error) {
        reject(error); // Handle any errors
      }
    };

    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsArrayBuffer(file);
  });
};

const FileUpload = () => {
  const [file, setFile] = useState(null); // Base64 file content
  const [fileType, setFileType] = useState(""); // File MIME type
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [data, setData] = useState(null);
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  const dispatch = useDispatch();
  const getResponseFromGemini = async (fileBase64, mimeType) => {
    try {
      setLoading(true);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const imagePart = {
        inlineData: {
          data: fileBase64.split(",")[1], // Remove base64 prefix
          mimeType,
        },
      };

      const result = await model.generateContent([prompt3, imagePart]);
      setOutput(result.response.text());
      setFileUploadModal(false);
    } catch (error) {
      console.error("Error during AI processing:", error);
      alert("An error occurred while processing your file.");
    } finally {
      setLoading(false);
    }
  };

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/vnd.ms-excel", // For .xls files
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // For .xlsx files
  ];

  const handleFileChange = async (e) => {
    let selectedFile = e.target.files[0];
    if (
      selectedFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const pdfFile = await convertExcelToPDF(selectedFile);
      selectedFile = pdfFile;
    }

    console.log("selectedFile", selectedFile, selectedFile.type);

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size should not exceed ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      alert("Only PDF, JPEG, and PNG files are allowed.");
      return;
    }

    setFileType(selectedFile.type);

    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result); // Base64 content
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || !fileType) {
      alert("Please upload a valid file.");
      return;
    }
    await getResponseFromGemini(file, fileType);
  };

  const renderFilePreview = () => {
    if (fileType.startsWith("image/")) {
      return <img src={file} alt="Preview" className="w-full h-[80%]" />;
    } else if (fileType === "application/pdf") {
      return (
        <iframe src={file} title="PDF Preview" className="w-[80%] h-[80%]" />
      );
    } else {
      return <p className="text-sm text-gray-500">No preview available.</p>;
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setFile(null);
    setFileType("");
  };
  function removeFirstAndLastThreeChars(str) {
    if (str?.length <= 6) {
      // If the string has 6 or fewer characters, return an empty string
      return "";
    }
    return str?.slice(7, -3);
  }

  useEffect(() => {
    if (!output) return;

    try {
      const data = removeFirstAndLastThreeChars(output);
      // console.log("first", data);
      if (data) {
        const parsedData = JSON.parse(data);
        dispatch(setDataForTable(parsedData));
      } else {
        console.warn("No valid JSON content to parse.");
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error);
    }
  }, [output]);

  return (
    <div className="w-full flex justify-center items-center flex-col">
      {fileUploadModal && (
        <Modal onClose={() => setFileUploadModal(false)}>
          <div className="flex flex-col items-center justify-center w-full h-full bg-white p-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Upload your file</h2>
              <p className="text-xs text-gray-500 my-2">
                File should be PDF, JPEG, or PNG.
              </p>
            </div>
            <form className="relative w-full h-[80%] mb-10 bg-gray-100 rounded-lg shadow-inner">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="z-20 flex flex-col items-center justify-center w-full h-full cursor-pointer"
              >
                {file ? (
                  renderFilePreview()
                ) : (
                  <>
                    <p className="z-10 text-xs font-light text-gray-500">
                      Drag & Drop your files here
                    </p>
                    <svg
                      className="z-10 w-8 h-8 text-indigo-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                    </svg>
                  </>
                )}
              </label>
              <button
                onClick={handleRemoveImage}
                className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
              >
                <IoClose size={24} />
              </button>
            </form>
            <button
              className="p-2 border-gray-500 shadow-md rounded w-fit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Extract Data"}
            </button>
          </div>
        </Modal>
      )}

      <button
        className="p-2 border-gray-500 shadow-md rounded w-fit"
        onClick={() => setFileUploadModal(true)}
        disabled={loading}
      >
        Upload File
      </button>
    </div>
  );
};

export default FileUpload;
