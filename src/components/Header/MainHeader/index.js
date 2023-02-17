import React from "react";

import { Link } from "react-router-dom";

import Logo from "assets/icons/logo.png";
import GoBack from "components/Previous";

import "./styles.scss";

const MainHeader = ({ back, text, method, goback }) => {
  const userEmail = localStorage.getItem("@App:userEmail");

  return (
    <div className="mainHeader">
      <div className="Navbar">
        <div className="NavContent">
          <div>
            <Link to="/">
              <img src={Logo} alt="Logo porquem" />
            </Link>
          </div>
          <div className="link">
            {userEmail ? (
              <>
                <Link
                  style={{ paddingRight: "20px" }}
                  to="/institution/profile"
                >
                  {userEmail.replace(/['"]+/g, "")}
                </Link>
              </>
            ) : (
              <></>
            )}
            {method ? (
              <>
                <Link className="routeTo" to={back} onClick={() => method()}>
                  {text}
                </Link>
              </>
            ) : (
              <>
                <Link className="routeTo" to={back}>
                  {text}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {!goback ? <GoBack /> : ""}
    </div>
  );
};
export default MainHeader;
