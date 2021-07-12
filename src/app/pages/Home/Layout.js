import "./index.css";

import { Component } from "react";

import { Banner } from "../../components";
import {
  blueBook,
  blueBulb,
  blueRead,
  redBook,
  redBulb,
  redRead,
} from "../../../static";

const images = [blueBook, blueBulb, blueRead, redBook, redBulb, redRead];

class Layout extends Component {
  render() {
    return (
      <div className="auth">
        <Banner />
        <div className="auth-layout">
          <div className="auth-left">
            <img
              src={images[Math.floor(Math.random() * images.length)]}
              class="auth-img"
              alt="Idea pen"
            />
          </div>
          <div className="auth-right">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default Layout;
