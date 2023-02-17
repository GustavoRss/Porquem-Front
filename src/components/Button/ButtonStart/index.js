import React from "react";

import { Link } from "react-router-dom";

import "./styles.scss";

const ButtonStart = ({ texto, link, icon }) => (
  <div className="buttonStart">
    <Link to={link}>
      {texto}
      <span>
        <img src={icon} alt="" />
      </span>
    </Link>
  </div>
);

export default ButtonStart;
