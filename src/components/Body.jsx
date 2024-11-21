import React from "react";
import Tabs from "./Tabs";
import FileUpload from "./FileUpload";
import Modal from "./Modal";
import Table from "./Table";

const Body = () => {
  return (
    <div className="w-full">
      <Tabs />
      <FileUpload />
      <Table />
    </div>
  );
};

export default Body;
