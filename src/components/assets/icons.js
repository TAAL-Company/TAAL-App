import React from "react";
import Logo from "./icons/Logo.svg";
import Home_Ic from "./icons/Home_Ic.svg";
import arrow_Ic from "./icons/arrow_Ic.svg";
import backIcon from "./icons/backArrow_Ic.svg";
import Ic_stress from "./icons/Ic_stress.svg";
// import Ic_stress_grey from "./icons/Ic_stress_grey.svg";
import styled from "styled-components";

export const LogoModal = (props) => (
  <div style={{ display: "flex", alignItems: "flex-end" }}>
    <img
      alt={"logo"}
      src={Logo}
      width={props.width ? props.width : 25}
      height={props.width ? props.width : 25}
    />
  </div>
);

export const HomeIcon = (props) => (
  <div>
    <img
      alt={"home icon"}
      src={Home_Ic}
      width={props.width ? props.width : 25}
      height={props.width ? props.width : 25}
    />
  </div>
);

export const ArrowIcon = (props) => (
  <div>
    <img
      alt={"arrow icon"}
      src={arrow_Ic}
      width={props.width ? props.width : 25}
      height={props.width ? props.width : 25}
    />
  </div>
);

export const BackIcon = (props) => (
  <div>
    <img
      alt={"back icon"}
      src={backIcon}
      width={props.width ? props.width : 25}
      height={props.width ? props.width : 25}
    />
  </div>
);
export const StressIconRed = (props) => (
  <div>
    <img
      alt={"Stress Red"}
      src={Ic_stress}
      width={props.width ? props.width : 25}
      height={props.width ? props.width : 25}
    />
  </div>
);
export const StressIconGrey = (props) => (
  <div>
    <img
      alt={"Stress Red"}
      src={Ic_stress}
      width={props.width ? props.width : 25}
      height={props.width ? props.width : 25}
    />
  </div>
);
