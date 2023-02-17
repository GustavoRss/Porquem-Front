import React, { useEffect } from "react";

import Aos from "aos";
import Typist from "react-text-typist";
import { BsArrowRightShort } from "react-icons/bs";

import DoadorImg from "assets/arts/doador.png";
import ContactImg from "assets/arts/contactArt.png";
import ConnectionImg from "assets/arts/connection.png";
import QuemSomosImg from "assets/arts/quemSomos.png";

import Slider from "components/Slider";
import Header from "components/Header/HomeHeader";
import ButtonStart from "components/Button/ButtonStart";
import Footer from "components/Footer/WithContentFooter";

import "./styles.scss";
import "aos/dist/aos.css";

const Home = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div className="homePage">
      <Header />
      <section className="mainSection">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm d-flex justify-content-center align-items-center">
              <div className="textLeftContent">
                <h1>
                  A plataforma ideal para
                  <br />
                  <Typist
                    sentences={[
                      " doadores",
                      " instituições filantrópicas",
                      " qualquer pessoa",
                    ]}
                    loop={true}
                  />
                </h1>
                <h3>
                  PorQuem é uma plataforma sem fins lucrativos criada com o
                  propósito de reunir todas as instituições de caridade e
                  doadores em apenas um lugar.
                </h3>
                <ButtonStart link="/list" texto="Comece agora" />
              </div>
            </div>

            <div
              className="col-sm d-flex justify-content-center align-items-center"
              data-aos="fade-right"
            >
              <Slider />
            </div>
          </div>
        </div>
      </section>
      <section className="donorSection" id="how_works">
        <div className="container">
          <div className="row">
            <div className="col-sm" data-aos="fade-right">
              <img src={DoadorImg} alt="Arte imagem do doador" />
            </div>
            <div className="col-sm" data-aos="fade-up">
              <em>Doadores</em>
              <h2 className="mt-3">
                Encontre instituições <br />
                <span>Saiba o que doar</span>
              </h2>
              <p>
                Você quer doar, mas não sabe como e quais instituições estão
                precisando da sua doação. Aqui você conhecerá várias
                instituições, e saberá quais precisam da sua ajuda.
              </p>
              <p>
                Não sabe o que doar? Não tem problema, no <b>PorQuem</b> você
                pode descobrir o que cada organização está precisando com apenas
                1 click.
              </p>
              <a className="startNow" href="/list">
                <span>Seja a mudança</span>
                <span>
                  <BsArrowRightShort />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="institutionSection">
        <div className="container">
          <div className="row">
            <div
              className="col-sm d-flex justify-content-center flex-column"
              data-aos="fade-right"
            >
              <em>Instituições Filantrópicas</em>
              <h2 className="mt-3">
                Encontre Doadores <br />
                <span>Divulgue suas necessidades</span>
              </h2>
            </div>
            <div className="col-sm mb-5" data-aos="fade-left">
              <p>
                O <b>PorQuem</b> é um plataforma gratuita que tem o objetivo de
                aproximar a sua instituição filantrópica com possíveis doadores.
              </p>
              <p>
                Divulgue as necessidades das campanhas informando aos possíveis
                doadores os recursos que a sua campanha está necessitando.
              </p>
              <a className="startNow" href="/institution-signup">
                <span>Consiga doações</span>
                <span>
                  <BsArrowRightShort />
                </span>
              </a>
            </div>
            <div className="col-sm-12" data-aos="fade-up">
              <img
                src={ConnectionImg}
                alt="Imagem, conectando Intituições e Doadores"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="contactSection" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-sm" data-aos="fade-right">
              <img src={ContactImg} alt="Imagem, solicite um cadastro" />
            </div>
            <div className="col-sm" data-aos="fade-up">
              <em>Para Instituições</em>
              <h2 className="mt-3">
                Entre em contato <br />
                <span>Solicite um cadastro</span>
              </h2>
              <p>
                Para você que possui ou representa uma instituição filantrópica,
                solicite um cadastro no PorQuem. É totalmente gratuito e
                validamos os seus dados em poucos dias.
              </p>
              <ButtonStart link="/list" texto="Comece agora" />
            </div>
          </div>
        </div>
      </section>
      <section className="contactSection" id="about_me">
        <div className="container">
          <div className="row">
            <div className="col-sm" data-aos="fade-right">
              <em>Quem Somos</em>
              <h2 className="mt-3">
                PorQuem <br />
                <span>Criado por Gustavo Reis </span>
              </h2>
              <p>
                Olá, eu sou o Gustavo. Sou apaixonado pelo desenvolvimento de
                soluções que facilitem o nosso dia-a-dia. Criei o <b>PorQuem</b>{" "}
                a partir de uma dúvida que eu mesmo vivi:{" "}
                <i>
                  "Quais instituições precisam do recurso que eu posso doar?"
                </i>
                .{" "}
              </p>
              <p>
                A partir dessa dúvida o <b>PorQuem</b> foi imaginado
                inicialmente como um trabalho para a conclusão do curso de
                Sistemas de Informação, na Universidade Estadual de Goiás.
              </p>
              <a
                className="startNow"
                href="https://www.linkedin.com/in/gustavorss"
              >
                <span>Converse comigo</span>
                <span>
                  <BsArrowRightShort />
                </span>
              </a>
            </div>
            <div
              className="col-sm"
              data-aos="fade-up"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{ width: "70%" }}
                src={QuemSomosImg}
                alt="Imagem, conectando Intituições e Doadores"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
