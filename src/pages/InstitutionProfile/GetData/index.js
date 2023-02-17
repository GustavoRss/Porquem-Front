import React, { useState, useEffect, useContext, useCallback } from "react";

import api from "services/api";
import { Link } from "react-router-dom";
import history from "context/history";
import { Context } from "context/authContext";
import Swal from "sweetalert2";
import ReactHtmlParser from "react-html-parser";

import BeatLoader from "react-spinners/BeatLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { AiFillStepBackward } from "react-icons/ai";

import Footer from "components/Footer/WithContentFooter";
import MainHeader from "components/Header/MainHeader";

import AvatarImg from "assets/arts/avatar.png";
import AnaliseImg from "assets/arts/emAnalise.png";
import WallpaperImg from "assets/arts/wallpaperDefault.png";
import BannerInstitution from "assets/arts/bannerInstitution.png";

import "./styles.scss";

const InstitutionProfileGetData = () => {
  const { handleLogout } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [isActiveProfile, setIsActiveProfile] = useState(true);
  const [entity, setEntity] = useState([]);
  const regex = /<\/?[^>]+(>|$)/g;

  const user = localStorage.getItem("@App:user");
  const token = localStorage.getItem("@App:token").replace(/['"]+/g, "");
  const today = new Date().setHours(0, 0, 0, 0);

  const getEntity = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/PhilanthropicEntity/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": false,
          processData: false,
        },
      });

      if (data.status === "AN" || data.status === "IN") {
        setIsActiveProfile(false);
      }
      setLoading(false);
      setEntity(data);
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Houve algum problema para carregar a página que você tentou acessar, verifique se o link está correto ou tente novamente mais tarde",
        confirmButtonColor: "#404040",
      }).then((result) => {
        if (result) {
          history.goBack();
        }
      });
    }
  }, [user, token]);

  useEffect(() => {
    setLoading(true);
    setEntity([]);
    getEntity();
  }, [getEntity]);

  function truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  function showImage(imageURL, path, type) {
    if (imageURL !== null) {
      return imageURL;
    } else {
      if (type === "logo") {
        return AvatarImg;
      } else {
        return WallpaperImg;
      }
    }
  }

  return (
    <div>
      {loading ? (
        <div className="loader">
          <BeatLoader size={30} color={"#42B983"} loading={loading} />
        </div>
      ) : (
        <>
          <div className="institutionProfile">
            <MainHeader back="#" text="Logout" method={handleLogout} />
            <div className="wallpaperInstitution">
              <img src={BannerInstitution} alt="Wallpaper da instituição" />
            </div>
            <div className="mainSection">
              <div className="container">
                <div className="card">
                  <div className="profile">
                    <div className="institutionImage">
                      {entity?.logo !== null ? (
                        <img
                          src={showImage(
                            entity?.logo,
                            "PhilanthropicEntities",
                            "logo"
                          )}
                          alt="Imagem da instituição"
                        />
                      ) : (
                        <img src={AvatarImg} alt="Imagem da instituição" />
                      )}
                    </div>
                    <div className="institutionContent">
                      <h3 className="mt-0">{entity.fantasyName}</h3>
                      <h4 className="mt-0">
                        {entity?.cause
                          ? entity?.cause
                          : "Aqui ficará a sua causa"}
                      </h4>
                      <h4 className="mt-5 mb-3">
                        Telefone: {entity.telephone}
                      </h4>
                      <h4 className="mt-0">
                        Email de contato:{" "}
                        {entity.contactEmail ? (
                          entity.contactEmail
                        ) : (
                          <small>Ainda não preenchido.</small>
                        )}
                      </h4>
                    </div>
                    <div style={{ margin: "0px 0px 0px auto" }}>
                      {entity.status !== "AN" && entity.status !== "IN" ? (
                        <Link
                          to="/institution/edit-profile"
                          className="btn-primary"
                        >
                          Editar Perfil
                        </Link>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <section className="contentSection">
                  <div className="card history">
                    <div className="cardTitle mb-4">
                      <h4>História</h4>
                    </div>

                    {entity?.history
                      ? ReactHtmlParser(entity?.history)
                      : "Não se preocupe, este é um texto de exemplo, após a confirmação do seu cadastro você poderá editá-lo."}
                  </div>
                  <div className="card">
                    <div className="cardTitle mb-4 d-flex justify-content-between align-items-center">
                      <h4>Campanhas</h4>
                      <Link
                        style={{ width: "140px" }}
                        to="/institution/campaign/create"
                        className="btn-primary-sm"
                      >
                        Cadastrar campanha
                      </Link>
                    </div>
                    {entity?.campaigns?.length > 0 ? (
                      ""
                    ) : (
                      <div style={{ flexGrow: "0" }}>
                        <p style={{ fontWeight: "bold" }}>
                          Nenhuma campanha cadastrada...
                        </p>
                      </div>
                    )}
                    <div className="row">
                      {entity?.campaigns?.map((ent, key) => {
                        return (
                          <div
                            className="col-sm-6 col-lg-4 col-md-6 d-flex justify-content-center mb-4"
                            key={key}
                          >
                            <div style={{ width: "100%" }}>
                              <Link
                                to={`/institution/campaign/${ent?.id}`}
                                className={
                                  new Date(ent?.endDate).getTime() < today
                                    ? "campaignCard disable-color"
                                    : "campaignCard enable-color"
                                }
                              >
                                <div className="campaignStatus">
                                  <span
                                    className={
                                      new Date(ent?.endDate).getTime() < today
                                        ? "FN"
                                        : "AT"
                                    }
                                  >
                                    {new Date(ent?.endDate).getTime() < today
                                      ? "Finalizada"
                                      : "Ativa"}
                                  </span>
                                </div>
                                <div>
                                  <div style={{ height: "220px" }}>
                                    <div className="campaignWallpaper">
                                      <img
                                        src={showImage(
                                          ent?.wallpaper,
                                          "Campaigns",
                                          "wallpaper"
                                        )}
                                        alt="Wallpaper da campanha"
                                      />
                                    </div>
                                    <div className="campaignImage">
                                      <img
                                        src={showImage(
                                          ent?.logo,
                                          "Campaigns",
                                          "logo"
                                        )}
                                        alt="Logo da campanha"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-sm-12 mt-4 d-flex">
                                    <div className="col-sm-12 mt-1">
                                      <strong>
                                        <h3 className="mt-2">{ent?.slogan}</h3>
                                      </strong>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 mt-2 mb-2 d-flex">
                                    <div className="col-sm-12 d-wrap align-items-center">
                                      <strong>Precisa de:</strong>
                                      {ent?.helpItems
                                        ?.slice(0, 4)
                                        .map((help, key, { length }) => {
                                          return (
                                            <strong
                                              key={key}
                                              className="d-flex align-items-center"
                                            >
                                              <span
                                                className={
                                                  new Date(
                                                    ent?.endDate
                                                  ).getTime() < today
                                                    ? "disable ml-2 my-2"
                                                    : "ml-2 my-2"
                                                }
                                              >
                                                {help?.helpType}
                                              </span>
                                              {length > 3 &&
                                              key + 1 === length ? (
                                                <small
                                                  className="pb-0 pl-2"
                                                  style={{
                                                    fontSize: "12px",
                                                    fontWeight: 500,
                                                    color: "#6ccead",
                                                    textDecoration: "underline",
                                                  }}
                                                >
                                                  Ver mais...
                                                </small>
                                              ) : (
                                                ""
                                              )}
                                            </strong>
                                          );
                                        })}
                                    </div>
                                  </div>
                                  <div className="col-sm-12 mt-3 pb-3 d-flex blockTwo">
                                    <div className="col d-flex flex-column justify-content-start">
                                      <p className="mb-3 mt-0">
                                        <strong
                                          className={
                                            new Date(ent?.endDate).getTime() <
                                            today
                                              ? "disable-color"
                                              : ""
                                          }
                                        >
                                          {" "}
                                          Data Início:{" "}
                                        </strong>
                                        <strong
                                          className={
                                            new Date(ent?.endDate).getTime() <
                                            today
                                              ? "disable-color"
                                              : "primary-color"
                                          }
                                        >
                                          {new Date(
                                            ent?.startDate
                                          ).toLocaleDateString()}
                                        </strong>
                                      </p>
                                      <p className="mb-0">
                                        <strong
                                          className={
                                            new Date(ent?.endDate).getTime() <
                                            today
                                              ? "disable-color"
                                              : ""
                                          }
                                        >
                                          {" "}
                                          Data Fim:{" "}
                                        </strong>
                                        <strong
                                          className={
                                            new Date(ent?.endDate).getTime() <
                                            today
                                              ? "disable-color"
                                              : "primary-color"
                                          }
                                        >
                                          {new Date(
                                            ent?.endDate
                                          ).toLocaleDateString()}
                                        </strong>
                                      </p>
                                    </div>
                                    <div className="col d-flex flex-column justify-content-start">
                                      <strong>Objetivo</strong>
                                      <small>
                                        {truncateString(
                                          ent?.objective,
                                          80
                                        ).replace(regex, "")}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className=" card">
                    <div className="cardTitle mb-4">
                      <h4>Contato da instituição</h4>
                    </div>
                    <div className="row">
                      <div className="col">
                        <strong>Telefone</strong> <br />
                        <p>{entity?.telephone}</p>
                      </div>
                      <div className="col">
                        <strong>E-mail de contato </strong>
                        <br />
                        <p>{entity?.contactEmail}</p>
                      </div>
                      <div className="col">
                        <strong>Endereço </strong>
                        <br />

                        <p>
                          {entity?.address?.publicPlace}, Número:{" "}
                          {entity?.address?.number}
                          <br />
                          {entity?.address?.complement
                            ? entity?.address?.complement + ", "
                            : ""}
                          {entity?.address?.district} <br />
                          {entity?.address?.cep
                            ? "CEP: " + entity?.address?.cep
                            : ""}{" "}
                          <br />
                          Cidade: {entity?.address?.city}
                          <br /> Estado: {entity?.address?.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <Footer />
          </div>
          {!isActiveProfile ? (
            <div className="isActiveProfile">
              <div className="cardAlert">
                <Link to="/list">
                  <AiFillStepBackward />
                </Link>
                <img src={AnaliseImg} alt="Perfil em análise" />
                <div className="d-flex justify-content-start align-items-center">
                  <strong>Status:</strong> <b className="AN">Em Análise</b>
                  <div className="loading">
                    <ClipLoader
                      size={20}
                      color={"#bdcf33"}
                      loading={!isActiveProfile}
                    />
                  </div>
                </div>
                <p>
                  A sua instituição ainda está em análise. Estamos verificando a
                  integridade dos dados que você enviou.
                </p>
                <p>
                  Assim que confirmarmos as suas informações, liberaremos o seu
                  perfil e te informaremos por e-mail.
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default InstitutionProfileGetData;
