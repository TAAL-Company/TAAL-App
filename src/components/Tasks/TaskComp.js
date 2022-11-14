import React, { useRef, useEffect, createRef } from "react";
// import { BsFillVolumeUpFill } from 'react-icons/bs';
import AudioIcon from "../assets/AudioIcon";
import CheckIcon from "../assets/CheckIcon";
import styled from "styled-components";
import { parseContent } from "./functions";

export default function TaskComp(props) {
  const decideColor = (type) => {
    if (type == null && isFocused()) return "orange";
    else if (type === true) return "green";
    else return "red";
  };

  const isFocused = () => props.index === props.currentIndex;

  return (
    <ContainerWrapper
      height={props.height}
      width={props.wrapperWidth ? props.wrapperWidth : 50}
    >
      <TaskContainer
        backgroundColor={decideColor(props.didFinished)}
        width={props.width ? props.width : 50}
        height={props.wideCaro ? props.wideCaro : isFocused() ? 100 : 60}
      >
        <WhiteContainer
          width={isFocused() && props.wideCaro === undefined ? 90 : 80}
          height={isFocused() && props.wideCaro === undefined ? 90 : 80}
        >
          <ImageWrapper
            maxHeight={isFocused() && props.wideCaro === undefined ? 58 : 100}
            borderWidth={isFocused() && props.wideCaro === undefined ? 1 : "0"}
          >
            <img
              alt={"task image"}
              src={
                props.imgUrl
                  ? props.imgUrl
                  : "https://globalimpactnetwork.org/wp-content/themes/globalimpact/images/no-image-found-360x250.png"
              }
              style={styles.imgStyle}
            />
          </ImageWrapper>
          <TopBar
            display={
              isFocused() && props.wideCaro === undefined ? "flex" : "none"
            }
          >
            <div style={{ width: "20%", height: "auto", marginTop: "auto" }}>
              <AudioIcon audioUrl={props.audioUrl} />
            </div>
            <div style={{ height: "100%", width: "79.5%", padding: 0 }}>
              <Text fontSize={3.5}>{props.title}</Text>
              <Text fontSize={2.8}>{parseContent(props.content)}</Text>
            </div>
          </TopBar>
        </WhiteContainer>
      </TaskContainer>
    </ContainerWrapper>
  );
}

const styles = {
  containerBox: {
    width: "50%",
    height: "250px",
    backgroundColor: "white",
    borderRadius: "2%",
    borderStyle: "solid",
    borderWidth: 6,
    display: "flex",
    flexDirection: "column",
  },

  aIconBox: {
    width: "15%",
  },
  cIconBox: {
    width: "22%",
  },
  imgStyle: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
  },
  leftBox: {
    flex: 1,
  },
  rightBox: {
    flex: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifycontent: "center",
  },
  textBox: {
    height: "17%",
    alignItems: "center",
    marginBottom: 5,
  },
  textStyle: {
    fontSize: 20,
    color: "black",
  },
};

const ContainerWrapper = styled.div`
  width: ${(props) => (props.width ? props.width : 50)}%;
  height: ${(props) => (props.height ? props.height : 90)}px;
  margin-left: auto;
  margin-right: auto;
`;

const TaskContainer = styled.div`
  height: ${(props) => (props.height ? props.height : 100)}%;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "white"};
  border-radius: 5pt;

  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const WhiteContainer = styled.div`
  background-color: white;
  width: ${(props) => (props.width ? props.width : 80)}%;
  height: ${(props) => (props.height ? props.height : 80)}%;
  padding: ${(props) => (props.padding ? props.padding : "6% 6% 2% 6%    ")};
  border-radius: 5pt;
  justify-content: space-between;
`;
const TopBar = styled.div`
  display: ${(props) => props.display};
  width: 100%;
  max-height: ${(props) => (props.maxHeight ? props.maxHeight : 42)}%;
  margin: auto;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  max-height: ${(props) => (props.maxHeight ? props.maxHeight : 52)}%;
  padding-bottom: 3px;
`;

const Text = styled.p`
  font-size: ${(props) => (props.fontSize ? props.fontSize : 2)}vw;
  text-align: right;
  font-family: "Arimo", sans-serif;
  margin: 0;
  padding: 0;
  max-height: 40px;
`;

const ImageBox = styled.div`
  overflow: hidden;
  height: 90%;
  width: 95%;
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 90)}%;
`;
