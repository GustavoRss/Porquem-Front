import React from "react";

import { Link } from "react-router-dom";

import "./styles.scss";

const ButtonRegister = ({ texto, link, icon }) => (
  <div className="buttonRegister">
    <Link to={link}>{texto}</Link>
  </div>
);

export default ButtonRegister;
