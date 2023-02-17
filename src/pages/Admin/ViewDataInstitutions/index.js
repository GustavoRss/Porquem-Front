import React, { useContext, useState, useEffect, useCallback } from "react";

import Aos from "aos";
import api from "services/api";

import { useParams } from "react-router-dom";
import history from "context/history";
import { Context } from "context/authContext";

import Swal from "sweetalert2";

import BeatLoader from "react-spinners/BeatLoader";

import MainHeader from "components/Header/MainHeader";
import Footer from "components/Footer/WithContentFooter";

import "./styles.scss";
import "aos/dist/aos.css";

const ViewDataInstitutions = () => {
  const { id } = useParams();

  const { handleLogout } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [updateStatus, setupdateStatus] = useState("");
  const [entity, setEntity] = useState([]);

  const token = localStorage.getItem("@App:token").replace(/['"]+/g, "");

  const getEntity = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/DataAdm/${id}`, {
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
  }, [id, token]);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const newStatus = {
        Status: updateStatus,
      };
      try {
        await api.put(`/DataAdm/${id}`, JSON.stringify(newStatus), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        await getEntity().then((res) => {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: "Os dados da instituição foram atualizados com sucesso",
            showConfirmButton: false,
          });
        });
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
    },
    [id, token, updateStatus, getEntity]
  );

  useEffect(() => {
    Aos.init({ duration: 1000 });
    getEntity();
    setLoading(true);
    setupdateStatus(entity.status);
  }, [getEntity, entity.status]);

  return (
    <div>
      {loading ? (
        <div className="loader">
          <BeatLoader size={30} color={"#42B983"} loading={loading} />
        </div>
      ) : (
        <div className="viewDataInstitutions">
          <MainHeader back="#" text="Logout" method={handleLogout} />

          <div className="mainSection viewDataContent">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  {entity?.status === "AN" && (
                    <span className="AN">Análise</span>
                  )}
                  {entity?.status === "IN" && (
                    <span className="IN">Inativo</span>
                  )}
                  {entity?.status === "AT" && <span className="AT">Ativo</span>}
                  {entity?.status === "AD" && <span className="AD">Admin</span>}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-8">
                  <div className="contentTitle">
                    <h3 className="mt-3 mb-1">
                      Razão Social: {entity?.corporateName}
                    </h3>
                    <p className="my-1">CNPJ: {entity?.cnpj}</p>
                    <h4>
                      Nome fantasia:{" "}
                      {entity?.corporateName ? entity.corporateName : "Unknown"}
                    </h4>
                    <h4>
                      Inscrição estadual:{" "}
                      {entity?.stateRegistration
                        ? entity?.stateRegistration
                        : "Unkown"}
                    </h4>
                  </div>
                </div>
                <div className="col-sm-4">
                  <p className="mb-0">
                    Criado em:{" "}
                    {new Date(entity?.createdAt).toLocaleDateString()} <br />
                    <small>{new Date(entity?.createdAt).toTimeString()}</small>
                  </p>

                  {entity?.documents?.documentPath?.substr(-3) === "png" && (
                    <a
                      href={`data:image/png;base64,${entity?.documents?.documentData}`}
                      download={entity?.documents?.documentPath}
                      className="document"
                    >
                      <small>Download do documento PNG</small>
                    </a>
                  )}
                  {entity?.documents?.documentPath?.substr(-3) === "pdf" && (
                    <a
                      href={`data:application/pdf;base64,${entity?.documents?.documentData}`}
                      download={entity?.documents?.documentPath}
                      className="document"
                    >
                      <small>Download do documento pdf</small>
                    </a>
                  )}
                  {entity?.documents?.documentPath?.substr(-3) === "jpg" && (
                    <a
                      href={`data:image/jpeg;base64,${entity?.documents?.documentData}`}
                      download={entity?.documents?.documentPath}
                      className="document"
                    >
                      <small>Download do documento jpeg</small>
                    </a>
                  )}
                  <p className="mt-3 mb-1"> {entity?.contactEmail}</p>
                  <p className="my-1">Telefone: {entity?.telephone}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-8 mt-2 mb-4 d-flex flex-column">
                  <h3 className="mb-0">Endereço:</h3>
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
                <div className="col-sm-4">
                  <h3>Alterar status da instituição:</h3>
                  <div className="d-flex">
                    <select
                      value={updateStatus}
                      onChange={(e) => {
                        setupdateStatus(e.target.value);
                      }}
                    >
                      <option value="AT">Ativo</option>
                      <option value="AN">Em Análise</option>
                      <option value="IN">Inativo</option>
                      <option value="AD">Administrador</option>
                    </select>
                    <button
                      onClick={submit}
                      type="submit"
                      className="btn-primary ml-3"
                    >
                      Alterar status
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 mt-2 mb-4 d-flex flex-column">
                  <h3 className="mb-0">Outras informações:</h3>
                  <p>
                    História:{" "}
                    {entity.history ? entity.history : "Ainda não preenchida"}
                  </p>
                  <p className="mt-1">
                    Causa:{" "}
                    {entity.cause ? entity.cause : "Ainda não preenchida"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default ViewDataInstitutions;
