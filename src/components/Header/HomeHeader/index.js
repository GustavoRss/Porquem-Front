import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import { CSSTransition } from "react-transition-group";

import Logo from "assets/icons/logo.png";

import ButtonRegister from "components/Button/ButtonRegister";

import "./styles.scss";

const HomeHeader = () => {
  const [activeMenu, setActiveMenu] = useState(false);

  return (
    <div className="Navbar">
      <div className="NavContent">
        <a href="/">
          <img src={Logo} alt="Logo porquem" />
        </a>
        <CSSTransition in={activeMenu} timeout={300} classNames="my-node">
          <div className="links" id={activeMenu ? "active" : "hidden"}>
            <div className="leftSide">
              <LinkScroll
                activeClass="active"
                to="how_works"
                spy={true}
                smooth={true}
              >
                Como Funciona?
              </LinkScroll>
              <LinkScroll
                activeClass="active"
                to="contact"
                spy={true}
                smooth={true}
              >
                Contato
              </LinkScroll>
              <LinkScroll
                activeClass="active"
                to="about_me"
                spy={true}
                smooth={true}
              >
                Quem somos
              </LinkScroll>
            </div>

            <div className="rightSide">
              <Link to="/login">Acessar</Link>
              <ButtonRegister texto="Cadastre-se" link="/institution-signup" />
            </div>
          </div>
        </CSSTransition>
      </div>
      <div className="menuTogle">
        <CSSTransition in={!activeMenu} timeout={300} classNames="my-menu">
          <button onClick={() => setActiveMenu(!activeMenu)}>
            {!activeMenu && <IoIosMenu></IoIosMenu>}
            {activeMenu && <IoMdClose></IoMdClose>}
          </button>
        </CSSTransition>
      </div>
    </div>
  );
};

export default HomeHeader;
