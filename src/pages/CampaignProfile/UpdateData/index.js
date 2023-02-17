import React, { useContext, useState, useEffect, useCallback } from "react";

import api from "services/api";

import history from "context/history";
import { MultiSelect } from "react-multi-select-component";
import DatePicker, { registerLocale } from "react-datepicker";
import ReactQuill from "react-quill";
import QuillConfig from "components/Quill";

import pt from "date-fns/locale/pt-BR";

import { Controller, useForm } from "react-hook-form";
import { Context } from "context/authContext";
import { useParams } from "react-router-dom";

import Swal from "sweetalert2";

import { GoAlert } from "react-icons/go";
import BeatLoader from "react-spinners/BeatLoader";

import MainHeader from "components/Header/MainHeader";
import Footer from "components/Footer/WithContentFooter";

import AvatarImg from "assets/arts/avatar.png";
import WallpaperImg from "assets/arts/wallpaperDefault.png";

import "./styles.scss";
import "aos/dist/aos.css";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";

const CampaignProfileUpdateData = () => {
  const { id } = useParams();
  const { handleLogout } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [entity, setEntity] = useState([]);
  const [selectedHelpItems, setSelectedHelpItems] = useState([]);
  const [optionsHelpItems, setOptionsHelpItems] = useState([]);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [wallpaper, setWallpaper] = useState({ preview: "", raw: "" });

  const token = localStorage.getItem("@App:token").replace(/['"]+/g, "");
  registerLocale("pt-BR", pt);

  const overrideStrings = {
    allItemsAreSelected: "Todos os itens foram selecionados.",
    clearSearch: "Limpar busca",
    search: "Pesquisa",
    selectSomeItems: "Selecione as necessidades",
  };

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
      const { data } = await api.get(`/Campaign/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": false,
          processData: false,
        },
      });

      setLoading(false);
      setEntity(data);
      setStartDate(data.startDate);
      setEndDate(data.endDate);

      let newData = data.helpItems.map((item) => {
        return {
          label: item.helpType,
          value: item.id,
        };
      });
      setSelectedHelpItems(newData);
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

  const getHelpItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/HelpItem/`);
      setLoading(false);

      let newData = data.map((item) => {
        return {
          label: item.helpType,
          value: item.id,
        };
      });

      setOptionsHelpItems(newData);
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

  const modules = QuillConfig("modules");
  const formats = QuillConfig("formats");

  useEffect(() => {
    getEntity();
    getHelpItems();
    setLoading(true);
  }, [getEntity, getHelpItems]);

  useEffect(() => {
    if (entity) {
      reset({
        slogan: entity?.slogan,
        wallpaper: entity?.wallpaper ? entity?.wallpaper : undefined,
        logo: entity?.logo ? entity?.logo : undefined,
        objective: entity?.objective,
        howHelp: entity?.howHelp,
        feedBack: entity?.feedBack,
        startDate: entity?.startDate,
        endDate: entity?.endDate,
        status: entity?.status,
      });
    }
  }, [entity, reset]);

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
      const regex = /<\/?[^>]+(>|$)/g;

      if (data.logo.file[0] != null) {
        await convertBase64(data.logo.file[0]).then((datablob) => {
          formData.append("logo", datablob);
        });
      }

      if (data.wallpaper.file[0] != null) {
        await convertBase64(data.wallpaper.file[0]).then((datablob) => {
          formData.append("wallpaper", datablob);
        });
      }

      data.logo = entity?.logo;
      data.wallpaper = entity?.wallpaper;
      data.PhilanthropicEntityId = entity?.philanthropicEntityId;
      data.startDate = new Date(startDate).toLocaleDateString("fr-CA");
      data.endDate = new Date(endDate).toLocaleDateString("fr-CA");
      let newHelpItems = selectedHelpItems.map((item) => {
        return {
          helpType: item.label,
          id: item.value,
        };
      });
      data.helpItems = newHelpItems;

      formData.append("campaign", JSON.stringify(data));
      if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        Swal.fire({
          icon: "error",
          title: "Ops",
          text: "A data do fim da campanha não pode ser menor que a data do início",
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (data.helpItems.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Ops",
          text: "Você deve inserir no mínimo uma necessidade na sua campanha de arrecação",
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (
        data.objective.replace(regex, "") === "" ||
        data.howHelp.replace(regex, "") === ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Ops",
          text: "Verifique se o objetivo da campanha ou as informações de como ajudar foram preenchidas",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        try {
          setLoading(true);
          await api.put(`/Campaign/ ${id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": false,
              processData: false,
            },
          });
          history.push("/institution/profile");
          Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: "Campanha criada com sucesso",

            showConfirmButton: false,
            timer: 3000,
          });
          setLoading(false);
        } catch (err) {
          setLoading(false);
          if (err.response) {
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
      }
    },
    [
      entity.philanthropicEntityId,
      entity.logo,
      selectedHelpItems,
      entity.wallpaper,
      id,
      startDate,
      endDate,
      token,
    ]
  );

  const handleChangeImg = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleChangeWallpaper = (e) => {
    if (e.target.files.length) {
      setWallpaper({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

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
        <div className="createCampaign">
          <MainHeader back="#" text="Logout" method={handleLogout} />
          <div className="mainSection">
            <div className="container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-sm-4 d-flex flex-column align-items-center leftColumn">
                    <div>
                      <div className="campaignImage">
                        {entity?.logo !== null && !image.preview ? (
                          <img
                            src={showImage(entity?.logo, "Campaigns", "logo")}
                            alt="Imagem da campanha"
                          />
                        ) : (
                          <img
                            src={image.preview ? image.preview : AvatarImg}
                            alt="Imagem da campanha"
                          />
                        )}
                      </div>
                      <h5 className="mb-2">Selecione a logo da campanha:</h5>
                      <input
                        type="file"
                        style={{
                          border: "none",
                          paddingLeft: "unset",
                          width: "100%",
                        }}
                        placeholder="Logo"
                        {...register("logo.file", {
                          validate: {
                            lessThan10MB: (files) =>
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
                      {errors?.logo?.file?.type === "required" && (
                        <p className="errorMessage">
                          <GoAlert className="pr-2" /> Logo obrigatória
                        </p>
                      )}
                      {errors?.logo?.file?.message && (
                        <p className="errorMessage">
                          <GoAlert className="pr-2" />
                          {errors?.logo?.file?.message}
                        </p>
                      )}
                      <div className="wallpaperImage mt-5">
                        {entity?.wallpaper !== null && !wallpaper.preview ? (
                          <img
                            src={showImage(
                              entity?.wallpaper,
                              "Campaigns",
                              "wallpaper"
                            )}
                            alt="Wallpaper da campanha"
                          />
                        ) : (
                          <img
                            src={
                              wallpaper.preview
                                ? wallpaper.preview
                                : WallpaperImg
                            }
                            alt="Wallpaper da campanha"
                          />
                        )}
                      </div>
                      <h5 className="mb-2">
                        Selecione o wallpaper da campanha:
                      </h5>
                      <input
                        type="file"
                        style={{
                          border: "none",
                          paddingLeft: "unset",
                          width: "100%",
                        }}
                        placeholder="Wallpaper"
                        {...register("wallpaper.file", {
                          validate: {
                            lessThan10MB: (files) =>
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
                        onChange={handleChangeWallpaper}
                      />
                      {errors?.wallpaper?.file?.type === "required" && (
                        <p className="errorMessage">
                          <GoAlert className="pr-2" /> Wallpaper obrigatória
                        </p>
                      )}
                      {errors?.wallpaper?.file?.message && (
                        <p className="errorMessage">
                          <GoAlert className="pr-2" />
                          {errors?.wallpaper?.file?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-8">
                    <div className="card p-4">
                      <h3 className="text-center">Dados da Campanha</h3>
                      <h4 className="text-center mt-0">
                        Edite abaixo os dados da campanha
                      </h4>

                      <div className="row mt-5">
                        <div className="col">
                          <label>Nome da campanha</label>
                          <input
                            type="text"
                            placeholder="Nome da campanha"
                            className="mt-2"
                            {...register("slogan", {
                              required: true,
                              maxLength: 100,
                            })}
                          />
                          {errors?.slogan?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Esse campo é
                              obrigatório
                            </p>
                          )}
                          {errors?.slogan?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Não pode exceder 100
                              caracteres
                            </p>
                          )}
                        </div>
                        <div className="col-sm-3">
                          <label>Data início</label>
                          <Controller
                            control={control}
                            {...register("startDate", { required: true })}
                            render={({ field }) => (
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                className="mt-2"
                                placeholderText="Data início"
                                selected={
                                  startDate ? new Date(startDate) : null
                                }
                                locale="pt-BR"
                                onChange={(date) => {
                                  setStartDate(date);
                                }}
                              />
                            )}
                          />

                          {errors?.startDate?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Obrigatório
                            </p>
                          )}
                          {errors?.startDate?.message && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" />{" "}
                              {errors?.startDate?.message}
                            </p>
                          )}
                        </div>
                        <div className="col-sm-3">
                          <label>Data fim</label>
                          <Controller
                            control={control}
                            {...register("endDate", { required: true })}
                            render={({ field }) => (
                              <DatePicker
                                dateFormat="dd/MM/yyyy"
                                className="mt-2"
                                placeholderText="Data fim"
                                selected={endDate ? new Date(endDate) : null}
                                locale="pt-BR"
                                onChange={(date) => {
                                  setEndDate(date);
                                }}
                              />
                            )}
                          />
                          {errors?.endDate?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Obrigatório
                            </p>
                          )}
                          {errors?.endDate?.message && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" />{" "}
                              {errors.endDate?.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-sm-12">
                          <label>Necessidades da campanha</label>
                          <MultiSelect
                            onChange={setSelectedHelpItems}
                            className="originSelect mt-2"
                            value={selectedHelpItems}
                            options={optionsHelpItems}
                            hasSelectAll={false}
                            labelledBy="Necessidades"
                            placeholder="Necessidades"
                            overrideStrings={overrideStrings}
                          />
                        </div>{" "}
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <label>Objetivo da campanha</label>
                          <Controller
                            control={control}
                            {...register("objective", {
                              required: true,
                              maxLength: 1000,
                            })}
                            render={({ field }) => (
                              <ReactQuill
                                placeholder="Objetivo"
                                className="editor mt-2"
                                theme="snow"
                                value={field.value ? field.value : null}
                                onChange={(text) => field.onChange(text)}
                                formats={formats}
                                modules={modules}
                              />
                            )}
                          />

                          {errors?.objective?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Esse campo é
                              obrigatório
                            </p>
                          )}

                          {errors?.objective?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Não pode exceder 1000
                              caracteres
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <label>Como ajudar?</label>
                          <Controller
                            control={control}
                            {...register("howHelp", {
                              required: true,
                              maxLength: 1500,
                            })}
                            render={({ field }) => (
                              <ReactQuill
                                placeholder="Como ajudar"
                                className="editor mt-2"
                                theme="snow"
                                value={field.value ? field.value : null}
                                onChange={(text) => field.onChange(text)}
                                formats={formats}
                                modules={modules}
                              />
                            )}
                          />

                          {errors?.howHelp?.type === "required" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Esse campo é
                              obrigatório
                            </p>
                          )}
                          {errors?.howHelp?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Não pode exceder 1500
                              caracteres
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col">
                          <label>Feedback da campanha</label>
                          <Controller
                            control={control}
                            {...register("feedBack", {
                              maxLength: 1000,
                            })}
                            render={({ field }) => (
                              <ReactQuill
                                placeholder="Feedback da campanha"
                                className="editor mt-2"
                                theme="snow"
                                value={field.value ? field.value : null}
                                onChange={(text) => field.onChange(text)}
                                formats={formats}
                                modules={modules}
                              />
                            )}
                          />

                          {errors?.feedBack?.type === "maxLength" && (
                            <p className="errorMessage">
                              <GoAlert className="pr-2" /> Não pode exceder 1000
                              caracteres
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 mb-1">
                        <button type="submit" className="buttonLogin">
                          Salvar campanha
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default CampaignProfileUpdateData;
