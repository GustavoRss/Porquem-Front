import React from "react";
import { Link } from "react-router-dom";

import expired from "assets/arts/expired.png";

import MainHeader from "components/Header/MainHeader";

import "./styles.scss";

const Expired = () => {
  return (
    <div className="expired">
      <MainHeader goback={true} back="/list" text="Voltar" />
      <div className="mainSection">
        <img src={expired} alt="Erro 404 página não encontrada" />

        <h3 className="text-center" style={{ marginTop: "0px" }}>
          Infelizmente a campanha que você tentou acessar já expirou ou não
          existe{" "}
        </h3>
        <Link className="btn-primary" to="/list">
          Ir para a listagem
        </Link>
      </div>
    </div>
  );
};

export default Expired;
