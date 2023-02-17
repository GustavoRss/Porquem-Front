import React, { useCallback, useState, useEffect } from "react";

import api from "services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import * as HiIcons from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

import "./styles.scss";

const Sidebar = () => {
  const dispatch = useDispatch();
  const handleSidebar = useSelector((state) => state.sidebar);
  const localization = useSelector((state) => state.localization);
  const searchCampaign = useSelector((state) => state.campaign);
  const selectedHelpItems = useSelector((state) => state.arr);

  const [toggle, setToggle] = useState([]);

  const [optionsHelpItems, setOptionsHelpItems] = useState([]);
  const institution = useSelector((state) => state.institution);

  function truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  const getHelpItems = useCallback(async () => {
    try {
      const { data } = await api.get(`/HelpItem/`);

      setOptionsHelpItems(data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Houve algum problema para carregar os dados, por favor recarregue a página e tente novamente.",
        confirmButtonColor: "#404040",
      });
    }
  }, []);

  const putSelectedItem = (e, key) => {
    toggle[key] = !toggle[key];

    dispatch({
      type: "SEARCH_HELPITEMS",
      value: e.target.value,
      selected: toggle[key],
    });
  };

  useEffect(() => {
    dispatch({
      type: "RESTART_LIST",
      value: true,
    });

    getHelpItems();
    setToggle([]);
  }, [getHelpItems, dispatch]);

  return (
    <div className="menuSidebar">
      <div className={handleSidebar ? "sidebar active" : "sidebar"}>
        {!handleSidebar ? (
          <Link to="#" className="menuBars">
            <HiIcons.HiOutlineMenuAlt2
              onClick={() =>
                dispatch({
                  type: "SIDEBAR_ACTIVE",
                  value: true,
                })
              }
            />
          </Link>
        ) : (
          <Link to="#" className="menuBars">
            <HiIcons.HiOutlineMenu
              onClick={() =>
                dispatch({
                  type: "SIDEBAR_ACTIVE",
                  value: false,
                })
              }
            />
          </Link>
        )}
        <small className="ml-4 d-flex align-items-center">
          <strong className="mr-2">Buscando por: </strong>
          {localization ? (
            <div className="searchFilter mr-2">
              {truncateString(localization, 20)}
            </div>
          ) : (
            ""
          )}
          {institution ? (
            <div className="searchFilter mr-2">
              {truncateString(institution, 20)}
            </div>
          ) : (
            ""
          )}
          {searchCampaign ? (
            <div className="searchFilter mr-2">
              {truncateString(searchCampaign, 20)}
            </div>
          ) : (
            ""
          )}
          {selectedHelpItems.length > 0 ? (
            <div className="mr-2">
              {selectedHelpItems?.map((help, key) => {
                return (
                  <strong key={key}>
                    <span className="ml-2 my-2 helpItem">{help}</span>
                  </strong>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </small>
      </div>
      <nav className={!handleSidebar ? "navMenu active" : "navMenu"}>
        <div>
          <h4
            style={{
              fontWeight: "400",
              textAlign: "center",
              fontSize: "1.2rem",
            }}
          >
            Filtros
          </h4>
        </div>
        <div className="filterSearch">
          <label>Localização</label>
          <input
            type="text"
            name="Search"
            onChange={(e) =>
              dispatch({
                type: "SEARCH_LOCALIZATION",
                value: e.target.value,
              })
            }
            placeholder="Busque por Estado ou Cidade"
          />
        </div>

        <div className="filterSearch">
          <label>Instituição Filantrópica</label>
          <input
            type="text"
            name="Search"
            onChange={(e) =>
              dispatch({
                type: "SEARCH_INSTITUTION",
                value: e.target.value,
              })
            }
            placeholder="Busque pelo nome da Instituição"
          />
        </div>
        <div className="filterSearch">
          <label>Nome da campanha</label>
          <input
            type="text"
            name="Search"
            onChange={(e) =>
              dispatch({
                type: "SEARCH_CAMPAIGN",
                value: e.target.value,
              })
            }
            placeholder="Busque pela campanha"
          />
        </div>
        <div className="filterSearch">
          <label>Necessidade</label>
          {optionsHelpItems?.map((ent, key) => {
            return (
              <div key={key}>
                <div className="filterCheckbox">
                  <input
                    type="checkbox"
                    className="switch_1"
                    value={ent?.helpType}
                    onClick={(e) => putSelectedItem(e, key)}
                  />
                  <span>{ent?.helpType}</span>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
