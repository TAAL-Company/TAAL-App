import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import './Barcode.css'
class BarcodeReader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 1000,
            result: this.props.result,
            error: 'No gooda',
            onchange: this.props.onchange,
            finished: false,
            scanning: this.props.scanning
        }
        this.handleScan = this.handleScan.bind(this)
    }


    handleScan = data => {
        if (this.props.scanning === true) {
            if (data == null)
                data = "error";

            this.setState({
                result: data
            })
            this.props.onchange(data)
        }
    }
    handleError = err => {
        console.error(err)
    }


    render() {
        return (
            <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{
                    height: '100%',
                    width: screen.width > 1023 ? '100%' : '60%',
                    overflow: 'hidden',
                }}
                className="barcodeContainer"
            />
        )
    }
}

export default BarcodeReader