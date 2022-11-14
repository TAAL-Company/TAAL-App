import React from 'react'
import styled from 'styled-components'
import FadeLoader from "react-spinners/FadeLoader";


function Spinner(props) {
    const { isLoading, color, size, top } = props
    return (
        <CenteredDiv top={top}>
            <FadeLoader color={color ? color : 'white'} loading={isLoading} size={size ? size : 200} />
        </CenteredDiv>
    )
}

export default Spinner
const CenteredDiv = styled.div`
    position: absolute;
    top: ${props => props.top ? props.top : 0};
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 123456;
`;