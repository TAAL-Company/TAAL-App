import React, { Component } from 'react';
import QrReader from 'react-qr-scanner'


class BarcodeComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 300,
            error: 'No gooda',
            onchange: this.props.onchange,
            finished: false,
            facingMode: 'rear'
        }

        this.handleScan = this.handleScan.bind(this)
        this.toggleCamera = this.toggleCamera.bind(this)
    }
    handleScan(data) {

        if (this.state.finished == false) {
            if (data == null)
                data = "error";
            else {
                this.setState({ finished: true })
            }

            this.setState({
                result: data
            })
            this.props.onchange(data)
        }

    }
    handleError(err) {
        console.error(err)
    }
    toggleCamera() {
        this.setState(prev => ({
            facingMode: prev.facingMode === 'rear' ? 'front' : 'rear',
            cameraKey: (prev.cameraKey || 0) + 1
        }))
    }
    render() {
        const { facingMode, cameraKey } = this.state
        return (
            <div>
                <QrReader
                    key={cameraKey}
                    delay={this.state.delay}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={styles.scannerBox}
                    facingMode={facingMode}
                />
                <button
                    onClick={this.toggleCamera}
                    style={styles.switchBtn}
                    type="button"
                >
                    {facingMode === 'rear' ? '🔄 Front Camera' : '🔄 Rear Camera'}
                </button>
            </div>
        )
    }
}

const styles = {
    scannerBox: {
        width: "100%",
        maxHeight: screen.height * 0.35,
        borderRadius: '2%'
    },
    switchBtn: {
        marginTop: '8px',
        width: '100%',
        padding: '8px',
        background: '#333',
        color: '#e8b221',
        border: '1px solid #555',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
    }
}
export default BarcodeComp