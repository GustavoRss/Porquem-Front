import React, { useState, useEffect, useContext, useCallback } from "react";

import api from "services/api";
import history from "context/history";
import { Link, useParams } from "react-router-dom";
import { Context } from "context/authContext";
import ReactHtmlParser from "react-html-parser";

import Swal from "sweetalert2";
import BeatLoader from "react-spinners/BeatLoader";

import Footer from "components/Footer/WithContentFooter";
import MainHeader from "components/Header/MainHeader";

import AvatarImg from "assets/arts/avatar.png";
import WallpaperImg from "assets/arts/wallpaperDefault.png";
import BannerCampaign from "assets/arts/bannerCampaign.png";

import "./styles.scss";

const CampaignProfileGetData = () => {
  const { id } = useParams();

  const { handleLogout } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState([]);
  const regex = /<\/?[^>]+(>|$)/g;

  const token = localStorage.getItem("@App:token").replace(/['"]+/g, "");

  const today = new Date().setHours(0, 0, 0, 0);

  const getEntity = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/Campaign/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": false,
          processData: false,
        },
      });

      setLoading(false);
      setEntity(data);
      console.clear();
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
  }, [token, id]);

  async function deleteEntity() {
    Swal.fire({
      icon: "warning",
      title: "Tem certeza?",
      text: "Tem certeza que deseja apagar essa campanha? Essa ação é irreversível!",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Excluir",
      confirmButtonColor: "#bf1650",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          api
            .delete(`/Campaign/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": false,
                processData: false,
              },
            })
            .then(function (ent) {
              history.push("/institution/profile");
              Swal.fire({
                text: "",
                title: "A campanha foi excluída com sucesso",
                icon: "success",
                confirmButtonColor: "#404040",
              });
            });
        } catch {
          Swal.fire(
            "Houve um erro para deletar esse registro, recarregue a página e tente novamente",
            "",
            "error"
          );
        }
      }
    });
  }

  useEffect(() => {
    getEntity();
    setLoading(true);
  }, [getEntity]);

  function showImage(imageURL, type) {
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
          <div className="campaignProfile">
            <MainHeader back="#" text="Logout" method={handleLogout} />
            <div className="bannerCampaign">
              <img src={BannerCampaign} alt="Wallpaper da instituição" />
            </div>
            <div className="mainSection">
              <div className="container">
                <div className="cardCampainProfile">
                  <div className="profile">
                    <div className="campaignWallpaper">
                      <img
                        src={showImage(entity?.wallpaper, "wallpaper")}
                        alt="Wallpaper da campanha"
                      />
                    </div>
                    <div className="campaignImage">
                      <img
                        src={showImage(entity?.logo, "logo")}
                        alt="Logo da campanha"
                      />
                    </div>
                  </div>
                  <div className="campaignTitle d-flex">
                    <div
                      style={{ maxWidth: "500px", width: "100%" }}
                      className="mr-5"
                    >
                      <h3 className="mt-0">{entity?.slogan}</h3>
                      <h4 className="mt-0">
                        Instituição: {entity?.philanthropicEntity?.fantasyName}
                      </h4>
                      <div className="d-flex mt-3">
                        <Link
                          to={`/institution/campaign/${id}/edit`}
                          className="btn-primary mr-3"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={deleteEntity}
                          className="btn-secondary"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2">
                        Data Início:{" "}
                        {new Date(entity?.startDate).toLocaleDateString()}
                      </p>
                      <p className="mb-2">
                        Data Fim:{" "}
                        {new Date(entity?.endDate).toLocaleDateString()}
                      </p>
                      <div className="d-flex align-items-center">
                        <p>Status</p>{" "}
                        <span
                          className={
                            new Date(entity?.endDate).getTime() < today
                              ? "ml-2 FN"
                              : "ml-2 AT"
                          }
                        >
                          {new Date(entity?.endDate).getTime() < today
                            ? "Finalizada"
                            : "Ativa"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <section className="contentSection">
                  <div className="card">
                    <h4 className="cardTitle">Objetivo da campanha</h4>
                    <p>{ReactHtmlParser(entity?.objective)}</p>
                  </div>
                  <div className="card">
                    <h4 className="cardTitle">Como ajudar?</h4>
                    <div className="d-wrap align-items-center mb-3 helpItems">
                      <strong>Precisa de:</strong>
                      {entity?.helpItems?.map((help, key) => {
                        return (
                          <strong>
                            <span key={key} className="ml-2 my-2">
                              {help?.helpType}
                            </span>
                          </strong>
                        );
                      })}
                    </div>
                    {ReactHtmlParser(entity?.howHelp)}
                  </div>
                  <div className="card">
                    <h4 className="cardTitle">Contato da instituição</h4>
                    <div className="row">
                      <div className="col">
                        <strong>Telefone</strong> <br />
                        <p>{entity?.philanthropicEntity?.telephone}</p>
                      </div>
                      <div className="col">
                        <strong>E-mail de contato</strong>
                        <br />
                        <p>{entity?.philanthropicEntity?.contactEmail}</p>
                      </div>
                      <div className="col">
                        <strong>Endereço </strong>
                        <br />

                        <p>
                          {entity?.philanthropicEntity?.address?.publicPlace},
                          Número: {entity?.philanthropicEntity?.address?.number}
                          <br />
                          {entity?.philanthropicEntity?.address?.complement
                            ? entity?.philanthropicEntity?.address?.complement +
                              ", "
                            : ""}
                          {entity?.philanthropicEntity?.address?.district}{" "}
                          <br />
                          {entity?.philanthropicEntity?.address?.cep
                            ? "CEP: " +
                              entity?.philanthropicEntity?.address?.cep
                            : ""}{" "}
                          <br />
                          Cidade: {entity?.philanthropicEntity?.address?.city}
                          <br /> Estado:{" "}
                          {entity?.philanthropicEntity?.address?.state}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <h4 className="cardTitle">Feedback da campanha</h4>
                    <p>
                      {entity?.feedBack?.replace(regex, "")
                        ? ReactHtmlParser(entity?.feedBack)
                        : "Essa campanha ainda não possui um feedback"}{" "}
                    </p>
                  </div>
                </section>
              </div>
            </div>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignProfileGetData;
