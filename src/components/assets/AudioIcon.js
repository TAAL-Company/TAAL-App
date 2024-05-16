import React from "react";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { Square, SquareWrapper } from "../assets/Styles";
import "./style.css";
const audio = new Audio();

function AudioIcon(props) {
  const { innerStyle, containerStyle } = props;

  return (
    <SquareWrapper width={props.width} style={containerStyle}>
      <Square style={innerStyle}>
        <button
          className=""
          id={props.id ? props.id : ""}
          onClick={() => {
            console.log("befor audio play");

            audio.setAttribute('src', props.audioUrl); //change the source
            audio.load(); //load the new source
            audio.play(); //play

            console.log("after audio play");
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
