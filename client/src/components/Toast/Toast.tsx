import React, { ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export function Toast(): ReactElement {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={6000}
        newestOnTop
        closeOnClick
        theme="colored"
        rtl={false}
        draggable
        pauseOnHover
      />
    </>
  );
}