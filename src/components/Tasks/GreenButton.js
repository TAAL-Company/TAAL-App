import React from 'react'
import styled from 'styled-components'
import { HomeIcon, ArrowIcon } from '../assets/icons';

function GreenButton(props) {
    const { content, iconType, onPress } = props
    return (
        <ButtonWrapper onClick={onPress}>
            <IconWrapper >
                <IconBox>
                    {iconType === "home" ? <HomeIcon /> : <ArrowIcon />}

                </IconBox>
            </IconWrapper>
            <TextWrapper>
                <Text className="whiteText">{content}</Text>
            </TextWrapper>
        </ButtonWrapper>
    )
}

export default GreenButton


const ButtonWrapper = styled.button`
    width: 90%;
    align-self: center;
    margin: 3% auto 0px auto;
    background-color: rgb(17, 185, 17);
    display: flex;
    border-width: 0px;
    align-items: center;
    border-radius: 4px;
    padding: 2%;
    
`;
const IconWrapper = styled.div`
    flex: 1;
    height: 60%;
    display: flex;
    justify-content: flex-end;
`;
const IconBox = styled.div`
 width: 70%;
`;
const TextWrapper = styled.div`
    flex: 3;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Text = styled.p`
    font-size: 2rem;
    margin: 0px;
    
`;