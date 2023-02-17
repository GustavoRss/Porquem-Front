import React, { createContext, useState, useEffect } from "react";
import api from "services/api";
import history from "./history";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";

const Context = createContext();

function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [haveRole, setHaveRole] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("@App:token");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);

      const { exp } = jwtDecode(token);
      const expirationTime = exp * 1000;
      if (Date.now() >= expirationTime) {
        localStorage.clear();
        history.push("/login");
        setAuthenticated(false);
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Sua sessão expirou, faça login novamente para continuar o seu acesso",
          confirmButtonColor: "#404040",
        });
      }
    }

    setLoading(false);
  }, [setAuthenticated]);

  async function handleLogin(login) {
    var loginJson = JSON.stringify(login);
    setLoading(true);
    try {
      await api
        .post(`User/Login`, loginJson, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(function (res) {
          localStorage.setItem("@App:token", JSON.stringify(res.data.token));
          localStorage.setItem("@App:user", JSON.stringify(res.data.id));
          localStorage.setItem(
            "@App:userEmail",
            JSON.stringify(res.data.email)
          );
          api.defaults.headers.Authorization = `Bearer ${res.data.token}`;
          if (res.data.roles[0].id === 4) {
            setHaveRole(true);
            history.push("/admin");
          } else {
            history.push("/institution/profile");
          }
          setAuthenticated(true);
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      history.push("/login");
      if (err.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "E-mail ou senha inválidos",
          confirmButtonColor: "#404040",
        });
      } else if (err.request) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Houve algum problema para carregar os dados, por favor recarregue a página e tente novamente.",
          confirmButtonColor: "#404040",
        });
      }
      console.clear();
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    setHaveRole(false);

    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:userEmail");
    localStorage.removeItem("@App:user");

    api.defaults.headers.Authorization = undefined;

    history.push("/login");

    Swal.fire({
      icon: "success",
      title: "Sucesso",
      text: "Você deslogou da sua conta",
      confirmButtonColor: "#404040",
    });
  }

  return (
    <Context.Provider
      value={{ authenticated, handleLogin, loading, handleLogout, haveRole }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, AuthProvider };
