import React from "react";
import { IoLogoLinkedin } from "react-icons/io";
import { AiOutlineGithub } from "react-icons/ai";

import "./styles.scss";

const MainFooter = () => {
  return (
    <section className="footerMain">
      <footer>
        <div className="container">
          <div>
            <span>© 2020 PorQuem, Inc. All rights reserved</span>
          </div>
          <div className="pt-1">
            <a href="https://github.com/GustavoRss">
              <AiOutlineGithub />
            </a>
            <a href="https://www.linkedin.com/in/gustavorss">
              <IoLogoLinkedin />
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default MainFooter;
