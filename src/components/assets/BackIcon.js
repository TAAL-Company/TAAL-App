import React from 'react'
import { IoRefresh } from 'react-icons/io5';
import { Square, SquareWrapper } from '../assets/Styles'


function BackIcon(props) {

    return (
        <button id={props.id ? props.id : ''}
            onClick={props.onClick}
            style={styles.iconBox}>
            <IoRefresh style={styles.audioIconStyle} />
        </button>
    )
}

export default BackIcon



const styles = {
    iconBox: {
        backgroundColor: "#256FA1",
        border: 0,
        borderRadius: "50%",
        outline: 'none',
        width: "100%",
        height: '100%',


    },
    audioIconStyle: {
        width: "100%",
        height: "100%",
        color: 'white',
    }
}
