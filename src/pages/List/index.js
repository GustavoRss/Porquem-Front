import React, { useEffect, useContext, useCallback, useState } from "react";

import api from "services/api";
import Swal from "sweetalert2";
import history from "context/history";
import BeatLoader from "react-spinners/BeatLoader";
import { useSelector } from "react-redux";
import { Context } from "context/authContext";

import { Link } from "react-router-dom";
import Sidebar from "components/Sidebar";
import MainHeader from "components/Header/MainHeader";

import AvatarImg from "assets/arts/avatar.png";
import WallpaperImg from "assets/arts/wallpaperDefault.png";

import "./styles.scss";

const List = () => {
  const handleSidebar = useSelector((state) => state.sidebar);
  const localization = useSelector((state) => state.localization);
  const searchCampaign = useSelector((state) => state.campaign);
  const selectedHelpItems = useSelector((state) => state.arr);
  const institution = useSelector((state) => state.institution);
  const [loading, setLoading] = useState(false);
  const { handleLogout } = useContext(Context);
  const [campaign, setCampaign] = useState();
  const userEmail = localStorage.getItem("@App:userEmail");
  const regex = /<\/?[^>]+(>|$)/g;

  const getCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/Visitor/Campaign`);

      setLoading(false);
      setCampaign(data);
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
  }, []);

  useEffect(() => {
    setLoading(true);
    setCampaign([]);
    getCampaigns();
  }, [getCampaigns]);

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

  const byLocalization = (ent) => {
    if (
      ent.philanthropicEntity?.address?.city
        ?.toLowerCase()
        .includes(localization?.toLowerCase())
    ) {
      return ent;
    } else if (
      ent.philanthropicEntity?.address?.state
        ?.toLowerCase()
        .includes(localization?.toLowerCase())
    ) {
      return ent;
    }
  };

  const byName = (ent) => {
    if (
      ent.philanthropicEntity?.fantasyName
        ?.toLowerCase()
        .includes(institution?.toLowerCase())
    ) {
      return ent;
    }
  };

  const byCampaign = (ent) => {
    if (ent.slogan?.toLowerCase().includes(searchCampaign.toLowerCase())) {
      return ent;
    } else if (ent.slogan === "") {
      return ent;
    }
  };

  const byHelpItems = (ent) => {
    var newHelpItems = [];
    ent.helpItems?.map((ent) => {
      return newHelpItems.push(ent.helpType);
    });

    if (selectedHelpItems.length > 0) {
      if (newHelpItems.some((r) => selectedHelpItems.indexOf(r) >= 0)) {
        return ent;
      }
    } else if (selectedHelpItems.length === 0) {
      return ent;
    }
  };

  return (
    <div className="list">
      <MainHeader
        back={userEmail ? "/login" : "/"}
        text={userEmail ? "Logout" : "Voltar"}
        method={userEmail ? handleLogout : ""}
      />
      <Sidebar />
      <section
        className={!handleSidebar ? "listSection" : "listSection active"}
      >
        {loading ? (
          <div className="loader">
            <BeatLoader size={30} color={"#42B983"} loading={loading} />
          </div>
        ) : (
          <>
            {campaign
              ?.filter(byLocalization)
              .filter(byName)
              .filter(byHelpItems)
              .filter(byCampaign)
              .map((ent, key) => {
                return (
                  <Link
                    key={key}
                    to={`campaign/${ent?.id}`}
                    className="listCard flasher"
                  >
                    <img
                      src={showImage(ent?.wallpaper, "Campaigns", "wallpaper")}
                      alt="wallpaper da campanha"
                    />

                    <img
                      src={showImage(
                        ent?.philanthropicEntity.logo,
                        "PhilanthropicEntities",
                        "logo"
                      )}
                      alt="imagem da campanha"
                      className="floatImage"
                    />

                    <div className="listCardContent">
                      <h3>{ent?.slogan}</h3>
                      <h4 className="mb-2">
                        <strong className="mr-1">instituição:</strong>{" "}
                        {ent?.philanthropicEntity?.fantasyName}
                      </h4>
                      <div>
                        <b className="mr-1">Precisa de: </b>
                        {ent?.helpItems
                          ?.slice(0, 4)
                          .map((help, key, { length }) => {
                            return (
                              <strong key={key}>
                                <span className="ml-2 my-2">
                                  {help?.helpType}
                                </span>
                                {length > 3 && key + 1 === length ? (
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

                        <br />
                      </div>
                      <b>Objetivos</b>
                      <p>
                        {truncateString(ent?.objective, 80).replace(regex, "")}
                      </p>
                      <b>Histórico de resultados</b>
                      <p>
                        {ent?.feedBack
                          ? truncateString(ent?.feedBack, 80).replace(regex, "")
                          : "Essa campanha ainda não possui um histórico de resultados."}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </>
        )}
      </section>
    </div>
  );
};

export default List;
