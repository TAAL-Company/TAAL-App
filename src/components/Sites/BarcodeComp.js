import React, { Component } from 'react';
import QrReader from 'react-qr-scanner'


class BarcodeComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 1000,
            error: 'No gooda',
            onchange: this.props.onchange,
            finished: false
        }

        this.handleScan = this.handleScan.bind(this)
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
    render() {
        return (
            <div>
                <QrReader
                    delay={this.state.delay}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={styles.scannerBox}
                    facingMode={'rear'}
                />
            </div>
        )
    }
}

const styles = {
    scannerBox: {
        width: "100%",
        maxHeight: screen.height * 0.35,
        borderRadius: '2%'
    }



}
export default BarcodeComp