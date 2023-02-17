import React from "react";

import { useHistory } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function GoBack() {
  let history = useHistory();
  const goToPreviousPath = () => {
    history.goBack();
  };
  return (
    <div className="goBack">
      <button onClick={goToPreviousPath}>
        <IoArrowBack /> Página anterior
      </button>
    </div>
  );
}

export default GoBack;
