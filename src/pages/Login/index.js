import React, { useEffect, useCallback, useContext, useState } from "react";

import Aos from "aos";
import api from "services/api";
import { Link } from "react-router-dom";
import { CgLogOut } from "react-icons/cg";
import { useForm } from "react-hook-form";
import { Context } from "context/authContext";
import { CSSTransition } from "react-transition-group";

import Swal from "sweetalert2";

import { GoAlert } from "react-icons/go";
import BeatLoader from "react-spinners/BeatLoader";

import DonerImg from "assets/arts/doner.png";

import Footer from "components/Footer/MainFooter";
import MainHeader from "components/Header/MainHeader";
import Button from "components/Button/ButtonPrimary";

import "./styles.scss";
import "aos/dist/aos.css";

const Login = () => {
  const { handleLogin, handleLogout, loading } = useContext(Context);
  const [loadingOld, setLoading] = useState(false);
  const [handleForgotPassword, setHandleForgotPassword] = useState(false);
  const userEmail = localStorage.getItem("@App:userEmail");

  useEffect(() => {
    Aos.init({ duration: 1000 });
    console.clear();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback(
    async (data) => {
      var login = { email: data.email, password: data.password };
      handleLogin(login);
    },
    [handleLogin]
  );
  const onForget = useCallback(async (email) => {
    email.email = email.forgotEmail;
    delete email.password;
    delete email.forgotEmail;
    try {
      setLoading(true);
      const { data } = await api.post("/User/forgot-password/", email);
      Swal.fire({
        icon: "success",
        title: "Tudo certo!",
        text: data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 5000,
      });

      setLoading(false);
    }
  }, []);

  return (
    <div>
      {loadingOld || loading ? (
        <div className="loader">
          <BeatLoader
            size={30}
            color={"#42B983"}
            loading={loading || loadingOld}
          />
        </div>
      ) : (
        <>
          <div className="login">
            <MainHeader
              back={userEmail ? "/login" : "/"}
              text={userEmail ? "Logout" : "Voltar"}
              method={userEmail ? handleLogout : ""}
            />
            <section className="mainSection d-flex align-items-center">
              <div className="container">
                <div className="row">
                  <div
                    className="col-sm d-flex align-items-center flex-column justify-content-center donerAccess"
                    data-aos="fade-right"
                  >
                    <img src={DonerImg} alt="Acesso de doadores" />
                    <Link to="/list">Sou doador</Link>
                  </div>
                  <div className="col-sm">
                    <form onSubmit={handleSubmit(onForget)}>
                      <CSSTransition
                        in={handleForgotPassword}
                        timeout={300}
                        classNames="forgot"
                      >
                        <div
                          className="col-sm"
                          id={handleForgotPassword ? "active" : "disable"}
                        >
                          <div
                            className="card p-4 forgotCard"
                            data-aos="zoom-in"
                          >
                            <div>
                              <Link
                                to="#"
                                onClick={() => setHandleForgotPassword(false)}
                                className="d-flex"
                              >
                                <CgLogOut />
                                Voltar para o login
                              </Link>
                            </div>
                            <div className="cardContent">
                              <h3 className="text-center">Recuperar senha</h3>
                              <input
                                type="text"
                                placeholder="E-mail para recuperação"
                                className="mt-3"
                                {...register("forgotEmail", {
                                  required: handleForgotPassword ? true : false,
                                  pattern: {
                                    value: handleForgotPassword
                                      ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                      : false,
                                  },
                                })}
                              />
                              {errors?.forgotEmail?.type === "required" &&
                                handleForgotPassword && (
                                  <p className="errorMessage">
                                    <GoAlert /> Esse campo é obrigatório
                                  </p>
                                )}
                              {errors?.forgotEmail?.type === "pattern" &&
                                handleForgotPassword && (
                                  <p className="errorMessage">
                                    <GoAlert /> E-mail inválido
                                  </p>
                                )}
                              <div className="mt-4">
                                <Button texto="Enviar" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CSSTransition>
                    </form>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <CSSTransition
                        in={handleForgotPassword}
                        timeout={300}
                        classNames="forgot"
                      >
                        <div
                          className="col-sm"
                          id={handleForgotPassword ? "disable" : "active"}
                        >
                          <div className="card p-4" data-aos="zoom-in">
                            <div>
                              <Link to="/institution-signup" className="d-flex">
                                <CgLogOut />
                                Não tenho cadastro
                              </Link>
                            </div>
                            <div className="cardContent">
                              <h3 className="text-center">Acesse sua conta</h3>
                              <input
                                type="text"
                                placeholder="E-mail"
                                className="mt-3"
                                {...register("email", {
                                  required: handleForgotPassword ? false : true,
                                  pattern: {
                                    value: handleForgotPassword
                                      ? false
                                      : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  },
                                })}
                              />
                              {errors?.email?.type === "required" &&
                                !handleForgotPassword && (
                                  <p className="errorMessage">
                                    <GoAlert /> Esse campo é obrigatório
                                  </p>
                                )}
                              {errors?.email?.type === "pattern" &&
                                !handleForgotPassword && (
                                  <p className="errorMessage">
                                    <GoAlert /> E-mail inválido
                                  </p>
                                )}
                              <input
                                type="password"
                                placeholder="Senha"
                                className="mt-3"
                                autoComplete="on"
                                {...register("password", {
                                  required: handleForgotPassword ? false : true,
                                })}
                              />
                              {errors?.password?.type === "required" && (
                                <p className="errorMessage">
                                  <GoAlert /> Senha é obrigatória
                                </p>
                              )}
                              <div className="forgotPassword">
                                <Link
                                  to="#"
                                  className="my-3 text-right"
                                  onClick={() => setHandleForgotPassword(true)}
                                >
                                  Esqueci a senha
                                </Link>
                              </div>
                              <Button texto="Acessar" />
                            </div>
                          </div>
                        </div>
                      </CSSTransition>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
