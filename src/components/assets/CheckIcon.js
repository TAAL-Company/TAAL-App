import React from 'react'
import { FaRegCheckCircle } from 'react-icons/fa';
import styled from 'styled-components'

function CheckIcon(props) {


    return (
        <React.Fragment>
            { props.isChecked ? (
                <CheckIconButton
                    onClick={props.onClick}
                    style={styles.iconBox}
                    backgroundColor={'#11b911'}
                >
                    <FaRegCheckCircle style={styles.audioIconStyle} />
                </CheckIconButton>) : (
                    <CheckIconButton
                        onClick={props.onClick}
                        style={styles.iconBox}
                        backgroundColor={'red'}
                    >
                        <FaRegCheckCircle style={styles.audioIconStyle} />
                    </CheckIconButton>)}
        </React.Fragment>
    )
}

export default CheckIcon


const styles = {
    iconBox: {
        border: 2,
        borderRadius: 2,
        outline: 'none',
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
        width: '100%',
        paddin: 0
    },
    audioIconStyle: {
        width: '100%',
        height: '95%',
        color: 'white',
    }
}

const CheckIconButton = styled.button`
    // box-shadow: 5px 8px 15px rgba(0, 0, 0, 0.5);
    background-color: ${props => props.backgroundColor ? props.backgroundColor : 'none'};
`;