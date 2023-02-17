import React, { useState, useCallback, useEffect } from "react";

import api from "services/api";
import BeatLoader from "react-spinners/BeatLoader";
import { Link } from "react-router-dom";
import AvatarImg from "assets/arts/avatar.png";
import BackgroundHome from "assets/backgrounds/backgroundHome.png";
import WallpaperImg from "assets/arts/wallpaperDefault.png";

import "./styles.scss";

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [campaign, setCampaign] = useState();
  const [loading, setLoading] = useState(false);
  const length = campaign?.length > 3 ? 3 : campaign?.length;
  const delay = 2500;
  const timeoutRef = React.useRef(null);
  const regex = /<\/?[^>]+(>|$)/g;

  const getCampaigns = useCallback(async () => {
    setLoading(true);

    const { data } = await api.get(`/Visitor/Campaign`);

    setLoading(false);
    setCampaign(data);
  }, []);

  useEffect(() => {
    setLoading(true);
    getCampaigns();
  }, [getCampaigns]);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrent(current === length - 1 ? 0 : current + 1),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [current, length]);

  if (campaign?.length <= 0) {
    return (
      <img src={BackgroundHome} alt="Imagem home" style={{ width: "100%" }} />
    );
  }

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
    <section className="slider">
      <div className="mainCardsTitle pl-4">
        <h3 className="my-2">Principais Campanhas</h3>
        <span>Clique abaixo e comece agora mesmo</span>
      </div>

      {loading ? (
        <div className="loader" style={{ height: "60vh" }}>
          <BeatLoader size={30} color={"#42B983"} loading={loading} />
        </div>
      ) : (
        <>
          {campaign?.map((slide, index) => {
            return (
              <div
                className={index === current ? "slide active" : "slide"}
                key={index}
              >
                {index === current && (
                  <>
                    <Link to="/list" className="listCard">
                      <img
                        src={showImage(
                          slide?.wallpaper,
                          "Campaigns",
                          "wallpaper"
                        )}
                        alt="Imagem do carrossel"
                      />
                      <div className="listCardContent">
                        <h3>{slide?.slogan}</h3>
                        <h4>
                          <strong className="mr-1">instituição:</strong>{" "}
                          {slide?.philanthropicEntity.fantasyName}
                        </h4>
                        <b>Objetivos</b>
                        <p>{slide?.objective?.replace(regex, "")}</p>
                        <b>Histórico de resultados</b>
                        <p>
                          {slide?.feedBack
                            ? truncateString(
                                slide?.feedBack?.replace(regex, ""),
                                60
                              )
                            : "Essa campanha ainda não possui um histórico de resultados."}
                        </p>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            );
          })}
        </>
      )}
    </section>
  );
};

export default Slider;
