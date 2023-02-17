import React, { useContext, useState, useEffect, useCallback } from "react";
import api from "services/api";

import history from "context/history";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Context } from "context/authContext";
import ReactQuill from "react-quill";
import QuillConfig from "components/Quill";

import Swal from "sweetalert2";

import { GoAlert } from "react-icons/go";
import BeatLoader from "react-spinners/BeatLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { AiFillStepBackward } from "react-icons/ai";

import MainHeader from "components/Header/MainHeader";
import Footer from "components/Footer/WithContentFooter";

import AvatarImg from "assets/arts/avatar.png";
import AnaliseImg from "assets/arts/emAnalise.png";

import "./styles.scss";
import "aos/dist/aos.css";
import "react-quill/dist/quill.snow.css";

const InstitutionProfileUpdate = () => {
  const { handleLogout } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [isActiveProfile, setIsActiveProfile] = useState(true);
  const [entity, setEntity] = useState([]);
  const [image, setImage] = useState({ preview: "", raw: "" });

  const user = localStorage.getItem("@App:user");
  const token = localStorage.getItem("@App:token").replace(/['"]+/g, "");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

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
  }, [user, token]);

  useEffect(() => {
    getEntity();
    setLoading(true);
  }, [getEntity]);

  useEffect(() => {
    if (entity) {
      reset({
        fantasyName: entity.fantasyName,
        contactEmail: entity.contactEmail,
        telephone: entity.telephone,
        cause: entity.cause,
        history: entity.history,
        address: {
          cep: entity.address?.cep,
          city: entity.address?.city,
          complement: entity.address?.complement,
          district: entity.address?.district,
          number: entity.address?.number,
          publicPlace: entity.address?.publicPlace,
          state: entity.address?.state,
        },
      });
    }
  }, [entity, reset]);

  const handleChangeImg = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();

      if (data.logo.file[0] != null) {
        await convertBase64(data.logo.file[0]).then((datablob) => {
          formData.append("fileBlob", datablob);
        });
      }

      data.logo = undefined;
      data.Id = entity.id;
      data.UserId = user;
      data.address.philanthropicEntityId = entity.id;

      formData.append("philanthropicEntity", JSON.stringify(data));
      try {
        setLoading(true);
        await api.put(`/PhilanthropicEntity/${entity.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": false,
            processData: false,
          },
        });
        setLoading(false);
        history.push("/institution/profile");
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Seus dados foram atualizados com sucesso",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (err) {
        if (err.response) {
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
      }
    },
    [entity.id, token, user]
  );

  const modules = QuillConfig("modules");
  const formats = QuillConfig("formats");

  function showImage(imageURL, path, type) {
    if (imageURL !== null) {
      return imageURL;
    } else {
      if (type === "logo") {
        return AvatarImg;
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
        <div className="editProfile">
          <MainHeader back="#" text="Logout" method={handleLogout} />
          <div className="mainSection">
            <div className="container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-sm-4 d-flex flex-column align-items-center leftColumn">
                    <div className="profileImage ">
                      {entity?.logo !== null && !image.preview ? (
                        <img
                          src={showImage(
                            entity?.logo,
                            "PhilanthropicEntities",
                            "logo"
                          )}
                          alt="Imagem da instituição"
                        />
                      ) : (
                        <img
                          src={image.preview ? image.preview : AvatarImg}
                          alt="Imagem da instituição"
                        />
                      )}
                    </div>
                    <div className="mt-5">
                      <h5 className="mb-2">Selecione a logo da instituição:</h5>
                      <input
                        type="file"
                        style={{ border: "none", paddingLeft: "unset" }}
                        placeholder="Logo"
                        {...register("logo.file", {
                          validate: {
                            lessThan600KB: (files) =>
                              files[0]?.size < 600000 ||
                              files[0]?.size == null ||
                              "Tamanho máximo de 600KB",
                            acceptedFormats: (files) =>
                              ["image/jpeg", "image/png"].includes(
                                files[0]?.type
                              ) ||
                              files[0]?.type == null ||
                              "Os formatos aceitos são: PNG e JPEG",
                          },
                        })}
                        onChange={handleChangeImg}
                      />
                      {errors?.logo?.file?.message && (
                        <p className="errorMessage">
                          <GoAlert className="pr-2" />
                          {errors?.logo?.file?.message}
                        </p>
                      )}

                      <h5 className="mt-5 mb-2">Nome da instituição:</h5>
                      <h3 className="mt-0">{entity.fantasyName}</h3>
                    </div>
                  </div>

                  <div className="col-sm-8">
                    <div className="card p-4">
                      <h3 className="text-center">
                        Dados da Instituição Filantrópica
                      </h3>
                      <h4 className="text-center mt-0">
                        Edite abaixo os seus dados
                      </h4>

                      <div className="row mt-5">
                        <div className="col">
                          <label>Nome Fantasia</label>
                          <input
                            type="text"
                            placeholder="Nome Fantasia"
                            className="mt-2"
                            {...register("fantasyName", {
                              required: true,
                              maxLength: 255,
                              minLength: 4,
                            })}
                          />
                          {errors?.fantasyName?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.fantasyName?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Não pode exceder 255 caracteres
                            </p>
                          )}
                          {errors?.fantasyName?.type === "minLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Mínimo de 4 caracteres
                            </p>
                          )}
                        </div>
                        <div className="col">
                          <label>E-mail de contato</label>
                          <input
                            type="text"
                            placeholder="E-mail"
                            className="mt-2"
                            {...register("contactEmail", {
                              required: true,

                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              },
                            })}
                          />
                          {errors?.contactEmail?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}

                          {errors?.contactEmail?.type === "pattern" && (
                            <p className="errorMessage">
                              <GoAlert /> E-mail inválido
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <label>Causa</label>
                          <input
                            type="text"
                            placeholder="Causa"
                            className="mt-2"
                            {...register("cause", {
                              required: true,
                              maxLength: 60,
                            })}
                          />
                          <small>Exemplo: Animais abandonados</small>
                          {errors?.cause?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.cause?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Não pode exceder 60 caracteres
                            </p>
                          )}
                        </div>
                        <div className="col">
                          <label>Telefone celular</label>
                          <input
                            type="text"
                            placeholder="Telefone"
                            className="mt-2"
                            {...register("telephone", {
                              required: true,
                              pattern: {
                                value:
                                  /^1\d\d(\d\d)?$|^0800 ?\d{3} ?\d{4}$|^(\(0?([1-9a-zA-Z][0-9a-zA-Z])?[1-9]\d\) ?|0?([1-9a-zA-Z][0-9a-zA-Z])?[1-9]\d[ .-]?)?(9|9[ .-])?[2-9]\d{3}[ .-]?\d{4}$/gm,
                              },
                            })}
                          />
                          {errors?.telephone?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Telefone é obrigatório
                            </p>
                          )}
                          {errors?.telephone?.type === "pattern" && (
                            <p className="errorMessage">
                              <GoAlert /> Telefone inválido
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <label>História da entidade</label>
                          <Controller
                            control={control}
                            {...register("history", {
                              required: true,
                              maxLength: 1500,
                            })}
                            render={({ field }) => (
                              <ReactQuill
                                placeholder="História"
                                className="editor mt-2"
                                theme="snow"
                                value={field.value ? field.value : null}
                                onChange={(text) => field.onChange(text)}
                                formats={formats}
                                modules={modules}
                              />
                            )}
                          />
                          <small>
                            Escreva sobre a história da sua instituição. Máximo
                            de 1500 caracteres.
                          </small>
                          {errors?.history?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.history?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Não pode exceder 1500 caracteres
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col">
                          <label>CEP</label>
                          <input
                            type="text"
                            placeholder="CEP"
                            className="mt-2"
                            {...register("address.cep", {
                              required: true,
                              pattern: {
                                value: /^([\d]{2})\.?([\d]{3})-?([\d]{3})/,
                              },
                            })}
                          />
                          {errors?.address?.cep?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.address?.cep?.type === "pattern" && (
                            <p className="errorMessage">
                              <GoAlert /> CEP inválido
                            </p>
                          )}
                        </div>
                        <div className="col">
                          <label>Logradouro</label>
                          <input
                            type="text"
                            placeholder="Logradouro"
                            className="mt-2"
                            {...register("address.publicPlace", {
                              required: true,
                              minLength: 4,
                              maxLength: 255,
                            })}
                          />
                          {errors?.address?.publicPlace?.type ===
                            "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.address?.publicPlace?.type ===
                            "minLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Mínimo de 4 caracteres
                            </p>
                          )}
                          {errors?.address?.publicPlace?.type ===
                            "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Máximo de 255 caracteres
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-sm-12">
                          <label>Complemento (opcional)</label>
                          <input
                            type="text"
                            placeholder="Complemento"
                            className="mt-2"
                            {...register("address.complement", {
                              required: false,
                              minLength: 4,
                              maxLength: 255,
                            })}
                          />
                          {errors?.address?.complement?.type ===
                            "minLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Mínimo de 4 caracteres
                            </p>
                          )}
                          {errors?.address?.complement?.type ===
                            "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Máximo de 255 caracteres
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <label>Bairro</label>
                          <input
                            type="text"
                            placeholder="Bairro"
                            className="mt-2"
                            {...register("address.district", {
                              required: true,
                              minLength: 4,
                              maxLength: 255,
                            })}
                          />
                          {errors?.address?.district?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.address?.district?.type === "minLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Mínimo de 4 caracteres
                            </p>
                          )}
                          {errors?.address?.district?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Máximo de 255 caracteres
                            </p>
                          )}
                        </div>
                        <div className="col">
                          <label>Número</label>
                          <input
                            type="text"
                            placeholder="Número"
                            className="mt-2"
                            {...register("address.number", {
                              required: true,
                              maxLength: 4,
                              pattern: {
                                value: /^-?[0-9]*$/,
                              },
                            })}
                          />
                          {errors?.address?.number?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.address?.number?.type === "pattern" && (
                            <p className="errorMessage">
                              <GoAlert /> Digite apenas números
                            </p>
                          )}
                          {errors?.address?.number?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Máximo de 4 caracteres
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <label>Estado</label>
                          <input
                            type="text"
                            placeholder="Estado"
                            className="mt-2"
                            {...register("address.state", {
                              required: true,
                              maxLength: 255,
                              pattern: {
                                value: /^[a-záàâãéèêíïóôõöúçñ ]+$/i,
                              },
                            })}
                          />
                          {errors?.address?.state?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.address?.state?.type === "pattern" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo aceita apenas letras
                            </p>
                          )}
                          {errors?.address?.state?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Máximo de 255 caracteres
                            </p>
                          )}
                        </div>
                        <div className="col">
                          <label>Cidade</label>
                          <input
                            type="text"
                            placeholder="Cidade"
                            className="mt-2"
                            {...register("address.city", {
                              required: true,
                              maxLength: 255,
                              pattern: {
                                value: /^[a-záàâãéèêíïóôõöúçñ ]+$/i,
                              },
                            })}
                          />
                          {errors?.address?.city?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo é obrigatório
                            </p>
                          )}
                          {errors?.address?.city?.type === "pattern" && (
                            <p className="errorMessage">
                              <GoAlert /> Esse campo aceita apenas letras
                            </p>
                          )}
                          {errors?.address?.city?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Máximo de 255 caracteres
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 mb-1">
                        <button type="submit" className="buttonLogin">
                          Salvar alterações
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <Footer />
          {!isActiveProfile ? (
            <div className="isActiveProfile">
              <div className="cardAlert">
                <Link to="/institution/profile">
                  <AiFillStepBackward />
                </Link>
                <img src={AnaliseImg} alt="Perfil em análise" />
                <div className="d-flex justify-content-start align-items-center">
                  <strong>Status:</strong> <b>Em Análise</b>
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
        </div>
      )}
    </div>
  );
};

export default InstitutionProfileUpdate;
