import React, {
  useEffect,
  useRef,
  useCallback,
  useContext,
  useState,
} from "react";

import Aos from "aos";
import Swal from "sweetalert2";
import api from "services/api";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Context } from "context/authContext";

import InputMask from "react-input-mask";
import { CgLogOut } from "react-icons/cg";
import { GoAlert } from "react-icons/go";
import BeatLoader from "react-spinners/BeatLoader";

import InstitutionSignupImg from "assets/backgrounds/institutionSignup.png";

import MainHeader from "components/Header/MainHeader";
import Footer from "components/Footer/WithContentFooter";

import "./styles.scss";
import "aos/dist/aos.css";

const InstitutionSignup = () => {
  const { handleLogin, handleLogout } = useContext(Context);
  const userEmail = localStorage.getItem("@App:userEmail");

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  useEffect(() => {
    Aos.init({ duration: 1000 });
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      const formData = new FormData();

      formData.append("file", data.documents.file[0]);
      formData.append("philanthropicEntity", JSON.stringify(data));
      try {
        await api
          .post(`/PhilanthropicEntity`, formData, {
            headers: {
              "Content-Type": false,
              processData: false,
            },
          })
          .then(function (res) {
            var login = { email: data.email, password: data.password };
            handleLogin(login);
            setLoading(false);
          });
      } catch (err) {
        setLoading(false);
        if (err.response) {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Já existe uma conta com esse e-mail",
            confirmButtonColor: "#404040",
          });
        } else if (err.request) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Houve algum problema para carregar os dados, por favor recarregue a página e tente novamente.",
            confirmButtonColor: "#404040",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Houve algum problema para carregar os dados, por favor recarregue a página e tente novamente.",
            confirmButtonColor: "#404040",
          });
        }
        console.clear();
      }
    },
    [handleLogin]
  );

  return (
    <div>
      {loading ? (
        <div className="loader">
          <BeatLoader size={30} color={"#42B983"} loading={loading} />
        </div>
      ) : (
        <>
          <div className="institutionSignup">
            <MainHeader
              back={"/login"}
              text={userEmail ? "Logout" : "Voltar"}
              method={userEmail ? handleLogout : ""}
            />

            <section className="mainSection d-flex align-items-start">
              <div className="container">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-sm-8">
                      <div className="card p-4" data-aos="zoom-in">
                        <div>
                          <Link to="/login" className="d-flex">
                            <CgLogOut />
                            Já tenho uma conta
                          </Link>
                        </div>

                        <h3 className="text-center">Solicitação de cadastro</h3>
                        <h4>Informações da Instituição</h4>
                        <div className="row">
                          <div className="col">
                            <label>Nome Fantasia</label>
                            <input
                              type="text"
                              placeholder="Nome Fantasia"
                              className="mt-1"
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
                            <label>Razão Social</label>
                            <input
                              type="text"
                              placeholder="Razão Social"
                              className="mt-1"
                              {...register("corporateName", {
                                required: true,
                                maxLength: 255,
                                minLength: 4,
                              })}
                            />
                            {errors?.corporateName?.type === "required" && (
                              <p className="errorMessage">
                                <GoAlert /> Esse campo é obrigatório
                              </p>
                            )}
                            {errors?.corporateName?.type === "maxLength" && (
                              <p className="errorMessage">
                                <GoAlert /> Não pode exceder 255 caracteres
                              </p>
                            )}
                            {errors?.corporateName?.type === "minLength" && (
                              <p className="errorMessage">
                                <GoAlert /> Mínimo de 4 caracteres
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col">
                            <label>CNPJ</label>
                            <InputMask
                              className="mt-1"
                              placeholder="CNPJ"
                              mask="99.999.999/0009-99"
                              {...register("cnpj", {
                                required: true,
                                minLength: 14,
                                pattern: {
                                  //eslint-disable-next-line
                                  value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/,
                                },
                              })}
                            />
                            {errors?.cnpj?.type === "required" && (
                              <p className="errorMessage">
                                <GoAlert /> Esse campo é obrigatório
                              </p>
                            )}
                            {errors?.cnpj?.type === "pattern" && (
                              <p className="errorMessage">
                                <GoAlert /> CNPJ inválido
                              </p>
                            )}
                          </div>
                          <div className="col">
                            <label>Inscrição Estadual (opcional)</label>
                            <input
                              type="text"
                              placeholder="Inscrição Estadual"
                              className="mt-1"
                              {...register("stateRegistration", {
                                required: false,
                                minLength: 10,
                                pattern: {
                                  value: /^-?[0-9]*$/,
                                },
                              })}
                            />
                            {errors?.stateRegistration?.type ===
                              "minLength" && (
                              <p className="errorMessage">
                                <GoAlert /> Número inválido
                              </p>
                            )}
                            {errors?.stateRegistration?.type === "pattern" && (
                              <p className="errorMessage">
                                <GoAlert /> Digite apenas números
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-sm-6">
                            <label>E-mail de contato</label>
                            <input
                              type="text"
                              placeholder="email@email.com"
                              className="mt-1"
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
                          <div className="col-sm-6">
                            <label>E-mail de acesso</label>
                            <input
                              type="text"
                              placeholder="email@email.com"
                              className="mt-1"
                              {...register("email", {
                                required: true,
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                },
                              })}
                            />
                            {errors?.email?.type === "required" && (
                              <p className="errorMessage">
                                <GoAlert /> Esse campo é obrigatório
                              </p>
                            )}
                            {errors?.email?.type === "pattern" && (
                              <p className="errorMessage">
                                <GoAlert /> E-mail inválido
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-sm-4">
                            <label>Telefone Celular</label>
                            <InputMask
                              type="text"
                              placeholder="Telefone Celular"
                              className="mt-1"
                              mask="(99) 99999-9999"
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
                          <div className="col-sm-4">
                            <label>Senha</label>
                            <input
                              type="password"
                              placeholder="Senha de acesso"
                              className="mt-1"
                              autoComplete="on"
                              {...register("password", {
                                required: true,
                                maxLength: 255,
                              })}
                            />
                            {errors?.password?.type === "required" && (
                              <p className="errorMessage">
                                <GoAlert /> Senha é obrigatória
                              </p>
                            )}
                            {errors?.password?.type === "maxLength" && (
                              <p className="errorMessage">
                                <GoAlert /> Máximo de 255 caracteres
                              </p>
                            )}
                          </div>
                          <div className="col-sm-4">
                            <label>Confirmar senha</label>
                            <input
                              type="password"
                              placeholder="Confirmar senha"
                              className="mt-1"
                              name="password_repeat"
                              ref="password_repeat"
                              autoComplete="on"
                              {...register("password_repeat", {
                                required: true,
                                validate: (value) =>
                                  value === password.current ||
                                  "As senhas não combinam",
                              })}
                            />
                            {errors?.password_repeat && (
                              <p className="errorMessage">
                                <GoAlert />{" "}
                                {errors.password_repeat.message
                                  ? errors.password_repeat.message
                                  : "Senha é obrigatória"}
                              </p>
                            )}
                          </div>
                        </div>
                        <h4>Endereço</h4>
                        <div className="row">
                          <div className="col-sm-4">
                            <label>CEP</label>

                            <InputMask
                              type="text"
                              placeholder="CEP"
                              className="mt-2"
                              mask="99999-999"
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
                          <div className="col-sm-8">
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
                            {errors?.address?.district?.type ===
                              "minLength" && (
                              <p className="errorMessage">
                                <GoAlert /> Mínimo de 4 caracteres
                              </p>
                            )}
                            {errors?.address?.district?.type ===
                              "maxLength" && (
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
                        <h4>Documentos</h4>
                        <div className="row">
                          <div className="col">
                            <h5
                              className="my-0"
                              style={{ color: "#359469", fontSize: "15px" }}
                            >
                              Anexe a Certidão Negativa de Tributo Trabalhista
                              ou algum documento que comprove os dados
                              preenchidos acima.
                            </h5>
                            <input
                              type="file"
                              placeholder="Documentos"
                              className="mt-3"
                              {...register("documents.file", {
                                required: true,
                                validate: {
                                  lessThan10MB: (files) =>
                                    files[0]?.size < 600000 ||
                                    "Tamanho máximo de 600KB",
                                  acceptedFormats: (files) =>
                                    [
                                      "image/jpeg",
                                      "image/png",
                                      "application/pdf",
                                    ].includes(files[0]?.type) ||
                                    "Os formatos aceitos são: PNG, JPEG e PDF",
                                },
                              })}
                            />
                            {errors?.documents?.file && (
                              <p className="errorMessage">
                                <GoAlert />{" "}
                                {errors.documents?.file?.message
                                  ? errors.documents?.file?.message
                                  : "O documento é obrigatório"}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="cardContent mt-5">
                          <button type="submit" className="buttonLogin">
                            Solicitar cadastro
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-sm">
                      <img
                        src={InstitutionSignupImg}
                        alt="Instituição filantrópica"
                        data-aos="fade-left"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </section>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default InstitutionSignup;
