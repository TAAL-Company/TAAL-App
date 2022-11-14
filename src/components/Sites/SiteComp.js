import React, { Component } from 'react'
import { BsFillVolumeUpFill } from 'react-icons/bs';
import AudioIcon from '../assets/AudioIcon'
import './SiteComp.css'
import styled from 'styled-components'


export default function SiteComp(props) {

    const decideColor = (type) => {
        if (type === "current")
            return "orange"
        else if (type === true)
            return 'green'
        else
            return 'red'
    }

    return (

        <SiteContainer
            width={props.width}
            backgroundColor={decideColor(props.didVisit)}>
            <WhiteContainer>
                < div style={styles.leftBox}>
                    <AudioIcon
                        audioUrl={props.audioUrl}
                    />
                </div>
                <div style={styles.rightBox}>
                    <div style={styles.imgBox}>
                        <img alt={'site image'} src={props.imgUrl || "https://globalimpactnetwork.org/wp-content/themes/globalimpact/images/no-image-found-360x250.png"} style={styles.imgStyle} />
                    </div>
                    <div style={styles.textBox}>
                        <p className="siteTxt" style={styles.textStyle}>{props.name}</p>
                    </div>
                </div>
            </WhiteContainer>
        </SiteContainer>

    );
}

let styles = {

    imgStyle: {
        width: '100%',
        borderRadius: 5,
        objectFit: 'cover'
    },
    leftBox: {
        flex: 1,
        display: 'block',
        marginTop: 'auto',
        marginBottom: 'auto',
        padding: '2% 2% 2% 0%',
    },
    rightBox: {
        flex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifycontent: 'center',
    },
    imgBox: {
        width: "100%",
        height: '82%',
        overflow: 'hidden'

    },
    textBox: {
        height: '18%',
        marginBottom: 6,
        fontFamily: 'Arimo',
    },
    textStyle: {

    },
    iconBox: {
        backgroundColor: "#e6b227",
        position: 'relative',
        borderRadius: "50%",
        width: "100%",
        height: 'auto',
        paddingTop: '60%',
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center"

    }


}
// width: 90%;
// height: 100px
// display: flex;
// background-color: white;
const WhiteContainer = styled.div`
   height: 85%;
    width: 90%;
    display: flex;
    padding: 2%;
    @media (min-width: 1024px) {
        flex-direction: row-reverse;
        @media (min-width: 1300px) {
            height: 85%;
            width: 88%;
        }
    }
    border-radius: 5pt;
    background-color: white;
    overflow: hidden;
`;
const SiteContainer = styled.div`
    @media (max-width: 1023px) {
        height: 130px;
        @media  (max-height: 570px) {
            height: 120px;
        }
        @media (min-height: 800px) and (max-height: 879px) {
            height: 170px;
        }
        @media (min-height: 720px) and (max-height: 799px) {
            height: 145px;
        }
        @media (min-height: 880px) {
            height: 190px;
        }
        @media (min-width: 480px){
            width:340px;
        }
    }
    @media (min-width: 1024px) {
        height: 20vh;
        @media (min-width: 1300px) {
            width: 320px;
            height: 24vh;
        }
    }
    width: ${props => props.width ? props.width : 260}px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5pt;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : 'red'};

    margin: 3%;
    overflow: hidden;
`;
