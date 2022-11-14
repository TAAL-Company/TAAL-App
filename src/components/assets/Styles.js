import styled from 'styled-components'


export const SquareWrapper = styled.div`
    background-color: ${props => props.backgroundColor ? props.backgroundColor : 'transparent'};
    width: ${props => props.width ? props.width : 100}%;
    display: flex;
    align-items: center;
    position: relative;
    &:after {
        content: "";
        display: table;
        padding-bottom: 100%;
    }
`;

export const Square = styled.div`
    width: ${props => props.width ? props.width : 100}%;
    height:  ${props => props.height ? props.height : 100}%;
    position: absolute;
`;

export const Divider = styled.hr`
    background-color: #aab1b1; 
    height: 1px;
    margin: 0;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: center;
    width: ${props => props.width ? props.width : 0}px;
    marginTop: ${props => props.marginTop ? props.marginTop : 2}px;
    @media (min-width: 532px) {
    display: none;
    }
`;