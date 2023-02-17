import React, { useState, useEffect, useContext, useCallback } from "react";

import api from "services/api";
import history from "context/history";
import { Context } from "context/authContext";
import { Link, useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

import BeatLoader from "react-spinners/BeatLoader";

import Footer from "components/Footer/WithContentFooter";
import MainHeader from "components/Header/MainHeader";

import AvatarImg from "assets/arts/avatar.png";
import WallpaperImg from "assets/arts/wallpaperDefault.png";
import BannerCampaign from "assets/arts/bannerCampaign.png";

import "./styles.scss";

const VisitorGetCampaign = () => {
  const { handleLogout } = useContext(Context);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const userEmail = localStorage.getItem("@App:userEmail");
  const regex = /<\/?[^>]+(>|$)/g;

  const today = new Date().setHours(0, 0, 0, 0);

  const getEntity = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/Visitor/Campaign/${id}`);

      setLoading(false);
      setCampaign(data);
      console.clear();
    } catch (err) {
      setLoading(false);
      history.push("/expired");
    }
  }, [id]);

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
          <div className="campaignVisitorProfile">
            <MainHeader
              back={userEmail ? "/login" : "/"}
              text={userEmail ? "Logout" : "Voltar"}
              method={userEmail ? handleLogout : ""}
            />
            <div className="bannerCampaign">
              <img src={BannerCampaign} alt="Wallpaper da instituição" />
            </div>
            <div className="mainSection">
              <div className="container">
                <div className="cardCampainProfile">
                  <div className="profile">
                    <div className="campaignWallpaper">
                      <img
                        src={showImage(campaign?.wallpaper, "wallpaper")}
                        alt="Wallpaper da campanha"
                      />
                    </div>
                    <div className="campaignImage">
                      <img
                        src={showImage(campaign?.logo, "logo")}
                        alt="Logo da campanha"
                      />
                    </div>
                  </div>
                  <div className="campaignTitle d-flex">
                    <div
                      style={{ maxWidth: "500px", width: "100%" }}
                      className="mr-5"
                    >
                      <h3 className="mt-0">{campaign?.slogan}</h3>
                      <div className="d-flex align-items-center">
                        <strong>Instituição: </strong>
                        <Link
                          to={`/institution/${campaign?.philanthropicEntity?.id}`}
                        >
                          <h4 className="pl-2 mt-0 mb-0">
                            {campaign?.philanthropicEntity?.fantasyName}
                          </h4>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2">
                        Data Início:{" "}
                        {new Date(campaign?.startDate).toLocaleDateString()}
                      </p>
                      <p className="mb-2">
                        Data Fim:{" "}
                        {new Date(campaign?.endDate).toLocaleDateString()}
                      </p>
                      <div className="d-flex align-items-center">
                        <p>Status</p>{" "}
                        <span
                          className={
                            new Date(campaign?.endDate).getTime() < today
                              ? "ml-2 FN"
                              : "ml-2 AT"
                          }
                        >
                          {new Date(campaign?.endDate).getTime() < today
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
                    <p>{ReactHtmlParser(campaign?.objective)}</p>
                  </div>
                  <div className="card">
                    <h4 className="cardTitle">Como ajudar?</h4>
                    <div className="d-wrap align-items-center mb-3 helpItems">
                      <strong>Precisa de:</strong>
                      {campaign?.helpItems?.map((help, key) => {
                        return (
                          <strong>
                            <span key={key} className="ml-2 my-2">
                              {help?.helpType}
                            </span>
                          </strong>
                        );
                      })}
                    </div>
                    <p>{ReactHtmlParser(campaign?.howHelp)}</p>
                  </div>
                  <div className="card">
                    <h4 className="cardTitle">Contato da instituição</h4>
                    <div className="row">
                      <div className="col">
                        <strong>Telefone</strong> <br />
                        <p>{campaign?.philanthropicEntity?.telephone}</p>
                      </div>
                      <div className="col">
                        <strong>E-mail de contato</strong>
                        <br />
                        <p>{campaign?.philanthropicEntity?.contactEmail}</p>
                      </div>
                      <div className="col">
                        <strong>Endereço </strong>
                        <br />

                        <p>
                          {campaign?.philanthropicEntity?.address?.publicPlace},
                          Número:{" "}
                          {campaign?.philanthropicEntity?.address?.number}
                          <br />
                          {campaign?.philanthropicEntity?.address?.complement
                            ? campaign?.philanthropicEntity?.address
                                ?.complement + ", "
                            : ""}
                          {campaign?.philanthropicEntity?.address?.district}{" "}
                          <br />
                          {campaign?.philanthropicEntity?.address?.cep
                            ? "CEP: " +
                              campaign?.philanthropicEntity?.address?.cep
                            : ""}{" "}
                          <br />
                          Cidade: {campaign?.philanthropicEntity?.address?.city}
                          <br /> Estado:{" "}
                          {campaign?.philanthropicEntity?.address?.state}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <h4 className="cardTitle">Feedback da campanha</h4>
                    <p>
                      {campaign?.feedBack?.replace(regex, "")
                        ? ReactHtmlParser(campaign?.feedBack)
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

export default VisitorGetCampaign;
