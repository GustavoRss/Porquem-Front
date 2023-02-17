import React, { useEffect, useCallback, useRef, useState } from "react";

import Aos from "aos";
import api from "services/api";

import Swal from "sweetalert2";
import history from "context/history";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import { GoAlert } from "react-icons/go";
import BeatLoader from "react-spinners/BeatLoader";

import ResetImg from "assets/arts/reset.png";

import Footer from "components/Footer/MainFooter";
import MainHeader from "components/Header/MainHeader";
import ButtonChangePassword from "components/Button/ButtonPrimary";

import "./styles.scss";
import "aos/dist/aos.css";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const query = useQuery();

  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const verifyToken = useCallback(async () => {
    try {
      var request = {
        token: query.get("token"),
      };
      await api.post("/User/verify/", request);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      history.push("/login");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Link inválido ou expirado",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }, [query]);

  useEffect(() => {
    verifyToken();
    setLoading(true);
  }, [verifyToken]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
    //console.clear();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = useCallback(
    async (request) => {
      setLoading(true);
      delete request.password_repeat;
      request.token = query.get("token");
      try {
        const { data } = await api.post("/User/reset-password/", request);
        history.push("/login");
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Tudo certo!",
          text: data.message,
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (error) {
        history.push("/login");
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Link inválido ou expirado",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
    [query]
  );

  return (
    <div>
      {loading ? (
        <div className="loader">
          <BeatLoader size={30} color={"#42B983"} loading={loading} />
        </div>
      ) : (
        <>
          <div className="login">
            <MainHeader
              back={"/login"}
              text={"Voltar"}
              method=""
              goback="false"
            />
            <section className="mainSection d-flex align-items-center">
              <div className="container">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div
                      className="col-sm d-flex align-items-center flex-column justify-content-around donerAccess"
                      data-aos="fade-right"
                    >
                      <img src={ResetImg} alt="Acesso de doadores" />
                    </div>
                    <div className="col-sm">
                      <div className="card p-4" data-aos="zoom-in">
                        <div className="cardContent">
                          <h3 className="text-center my-4">Alterar senha</h3>
                          <label>Nova senha</label>
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
                          {errors?.password?.type === "minLength" && (
                            <p className="errorMessage">
                              <GoAlert /> Máximo de 255 caracteres
                            </p>
                          )}
                          <label className="mt-3">Repetir a senha</label>
                          <input
                            type="password"
                            placeholder="Confirmar senha"
                            className="mt-1 "
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
                                : "Confirmação da senha é obrigatória"}
                            </p>
                          )}
                          <div className="mt-4">
                            <ButtonChangePassword texto="Alterar senha" />
                          </div>
                        </div>
                      </div>
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

export default ResetPassword;
