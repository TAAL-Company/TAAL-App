import React from 'react'
import Modal from 'react-modal';
import NavLink from '../Nav/NavLink';
import GreenButton from './GreenButton'
import './Tasks.css'
import styled from 'styled-components'
import { LogoModal, HomeIcon, ArrowIcon } from '../assets/icons';
import { useTranslation } from 'react-i18next';

export default function FinishModal(props) {
    const { places_location, userName, modalOpen, wideModal, onPressGoToSites } = props
    const { t } = useTranslation()
    return (
        <Modal
            closeTimeoutMS={600}
            isOpen={modalOpen}
            style={wideModal ? styles.wideModalStyle : styles.modalStyle}
            contentLabel="Example Modal"
        >
            <div className="modalContainer">
                <div className="modalHeader">
                    <LogoIconWrapper>
                        <LogoModal />

                    </LogoIconWrapper>
                    <div className="modalHeaderText">
                        <p className="whiteText modalTxt1">{t("well_done.1")}</p>
                    </div>

                </div>
                {
                    places_location === (-1) ? (
                        <div className="modalInfoBox">

                            <div style={{ flex: 1 }}>
                                <p className="modalTxt2">{t("completed_successfully.1")}</p>
                                <p className="modalTxt2">{t("completed_successfully.2")}</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <NavLink to={`/Sites/${userName}`}>
                                    <GreenButton onPress={onPressGoToSites} iconType={"home"} content={t("finish.1")} />
                                </NavLink>

                            </div>
                        </div>
                    ) : (
                        <div className="modalInfoBox">

                            <div style={{ flex: 1 }}>
                                <p className="modalTxt2">{t("finish_successfully.1")}</p>
                                <p className="modalTxt2">{t("finish_successfully.2")}</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <NavLink to={`/Sites/${userName}`}>
                                    <GreenButton onPress={onPressGoToSites} iconType={"Arrow"} content={t("continue.1")} />
                                </NavLink>
                            </div>
                        </div>
                    )
                }
            </div>
        </Modal>
    )
}

const styles = {
    modalStyle: {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.70)',
            zIndex: 1000
        },
        content: {
            position: 'unset',
            width: '90%',
            height: '50%',
            backgroundColor: 'rgb(80, 89, 92)',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '1%',
            alignSelf: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '50%',
            borderColor: 'green',
            padding: "0px",
        },
    },
    wideModalStyle: {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.70)',
            zIndex: 1000
        },
        content: {
            position: 'unset',
            width: '60%',
            height: '65%',
            backgroundColor: 'rgb(80, 89, 92)',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '1%',
            alignSelf: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '12%',
            borderColor: 'green',
            padding: "0px",
        },
    }
}

const LogoIconWrapper = styled.div`
    width: 18%;
`;