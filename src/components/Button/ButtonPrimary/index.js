import React from "react";

import "./styles.scss";

const ButtonPrimary = ({ texto, link, icon }) => (
  <div>
    <button type="submit" className="buttonLogin">
      {texto}
    </button>
  </div>
);

export default ButtonPrimary;
