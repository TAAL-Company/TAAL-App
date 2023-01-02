import React from "react";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { Square, SquareWrapper } from "../assets/Styles";
import "./style.css";

function AudioIcon(props) {
  const { innerStyle, containerStyle } = props;
  const audio = new Audio(props.audioUrl);

  return (
    <SquareWrapper width={props.width} style={containerStyle}>
      <Square style={innerStyle}>
        <button
          className=""
          id={props.id ? props.id : ""}
          onClick={() => {
            audio.play();
            console.log("change background color");
          }}
          style={styles.iconBox}
          aria-label={"audio"}
        >
          <BsFillVolumeUpFill style={styles.audioIconStyle} />
        </button>
      </Square>
    </SquareWrapper>
  );
}

export default AudioIcon;

const styles = {
  iconBox: {
    backgroundColor: "#e6b227",
    border: 0,
    borderRadius: "50%",
    outline: "none",
    width: "100%",
    height: "100%",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },

  audioIconStyle: {
    backgroundColor: "none",
    width: "100%",
    height: "100%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
