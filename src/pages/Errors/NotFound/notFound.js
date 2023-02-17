import React from "react";
import { Link } from "react-router-dom";

import PageNotFoundImg from "assets/arts/404.png";

import MainHeader from "components/Header/MainHeader";

import "./styles.scss";

const NotFound = () => {
  return (
    <div className="notFound">
      <MainHeader back="/" text="Voltar" />
      <div className="mainSection">
        <img src={PageNotFoundImg} alt="Erro 404 página não encontrada" />

        <h3 className="text-center">
          Não conseguimos encontrar a página que você está procurando
        </h3>
        <Link className="btn-primary" to="/">
          Ir para a home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
