import React, { useContext, useState, useEffect, useCallback } from "react";

import Aos from "aos";
import api from "services/api";
import history from "context/history";

import { Link } from "react-router-dom";
import { Context } from "context/authContext";

import Swal from "sweetalert2";

import BeatLoader from "react-spinners/BeatLoader";

import MainHeader from "components/Header/MainHeader";
import Footer from "components/Footer/WithContentFooter";

import "./styles.scss";
import "aos/dist/aos.css";

const ListInstitutions = () => {
  const { handleLogout } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [justAn, setJustAn] = useState(false);

  const token = localStorage.getItem("@App:token").replace(/['"]+/g, "");

  const sortedData = entity.sort(
    (a, b) =>
      new Date(...b.createdAt.split("/").reverse()) -
      new Date(...a.createdAt.split("/").reverse())
  );

  const getEntity = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/DataAdm`, {
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
  }, [token]);

  const dynamicFilter = (ent) => {
    if (!justAn) {
      if (searchTerm === "") {
        return ent;
      } else if (
        ent.corporateName?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return ent;
      }
    } else {
      if (ent.status?.toLowerCase().includes("AN".toLowerCase())) {
        return ent;
      }
    }
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });
    getEntity();
    setLoading(true);
  }, [getEntity]);

  return (
    <div>
      {loading ? (
        <div className="loader">
          <BeatLoader size={30} color={"#42B983"} loading={loading} />
        </div>
      ) : (
        <div className="listInstitutions">
          <MainHeader back="#" text="Logout" method={handleLogout} />
          <div className="searchInstitutions">
            <h3>Olá Admin</h3>
            <h4>Abaixo se encontra a listagem das instituições cadastradas</h4>
            <input
              type="text"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Filtro"
            />
            <div className="d-flex align-items-center pl-2">
              Mostrar apenas Instituições em Análise
              <input type="checkbox" onClick={() => setJustAn(!justAn)} />
            </div>
          </div>

          <div className="mainSection">
            <div className="container">
              <div
                className="row d-flex flex-wrap justify-content-start"
                style={{ minHeight: "355px" }}
              >
                {sortedData.filter(dynamicFilter).map((ent, key) => {
                  return (
                    <div
                      className="col-sm-6 col-lg-3 col-md-4 d-flex justify-content-center"
                      style={{ flexGrow: "0", minWidth: "390px" }}
                      key={key}
                    >
                      <div className="card">
                        <div className="cardContent">
                          <div
                            className="row justify-content-start"
                            style={{ width: "100%", margin: "0px" }}
                          >
                            <div className="col-sm-12 mt-2 mb-4 d-flex">
                              <div className="col-sm-8">
                                <h3>
                                  {ent.corporateName
                                    ? ent.corporateName
                                    : "Unknown"}
                                </h3>
                                <p> {ent.contactEmail}</p>
                                <p> Telefone: {ent.telephone}</p>
                              </div>
                              <div className="col d-flex align-items-start justify-content-end">
                                {ent.status === "AN" && (
                                  <span className="AN">Análise</span>
                                )}
                                {ent.status === "IN" && (
                                  <span className="IN">Inativo</span>
                                )}
                                {ent.status === "AT" && (
                                  <span className="AT">Ativo</span>
                                )}
                                {ent.status === "AD" && (
                                  <span className="AD">Admin</span>
                                )}
                              </div>
                            </div>
                            <div className="col-sm-12 mt-2 mb-4 d-flex">
                              <div className="col">
                                <p className="mb-0">
                                  Criado em:{" "}
                                  {new Date(ent.createdAt).toLocaleDateString()}{" "}
                                  <br />
                                  <small>
                                    {new Date(ent.createdAt).toTimeString()}
                                  </small>
                                </p>
                                {ent.documents.documentPath.substr(-3) ===
                                  "png" && (
                                  <a
                                    href={`data:image/png;base64,${ent.documents.documentData}`}
                                    download={ent?.documents?.documentPath}
                                    className="document"
                                  >
                                    Download PNG
                                  </a>
                                )}
                                {ent.documents.documentPath.substr(-3) ===
                                  "pdf" && (
                                  <a
                                    href={`data:application/pdf;base64,${ent.documents.documentData}`}
                                    download={ent?.documents?.documentPath}
                                    className="document"
                                  >
                                    Download pdf
                                  </a>
                                )}
                                {ent.documents.documentPath.substr(-3) ===
                                  "jpg" && (
                                  <a
                                    href={`data:image/jpeg;base64,${ent.documents.documentData}`}
                                    download={ent?.documents?.documentPath}
                                    className="document"
                                  >
                                    Download jpeg
                                  </a>
                                )}
                              </div>
                              <div className="col d-flex align-items-end justify-content-end">
                                <Link
                                  to={`/admin/${ent.id}`}
                                  className="btn-primary"
                                >
                                  Visualizar
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default ListInstitutions;
