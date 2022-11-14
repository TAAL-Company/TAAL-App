import React from 'react'
import styled from 'styled-components'
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function BlueArrow(props) {
    const { arrowDirection, onClickArrows, visible } = props
    return (
        <Circle visible={visible} onClick={() => onClickArrows(arrowDirection)}>
            {arrowDirection === 'right' ? <IoChevronForward color={'white'} size={38} />
                : <IoChevronBack color={'white'} size={38} />
            }
        </Circle>
    )
}

export default BlueArrow

const Circle = styled.div`
    background-color: rgb(37, 111, 161);
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${(props) => props.visible ? 1 : 0};
`;