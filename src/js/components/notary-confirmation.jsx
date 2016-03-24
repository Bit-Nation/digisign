import React, { Component } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import tweetnacl from 'tweetnacl';
import CryptoJS from 'crypto-js';
import JSZip from 'jszip';
import 'filesaverjs';
// import $ from 'jquery';

class NotaryConfirmation extends Component {

  constructor() {
    super();
    this.state = {
      dataSentToHZ: false,
      error: null
    };
  }

  componentDidMount() {
    //     Public key...
    // IDHTML.jsx:73 vJ4mCgXAprVO46/xTDZVbcVmPSy4FKp9h1NCNqSmw+g=
    // IDHTML.jsx:76 Secret key...
    // IDHTML.jsx:77 R5xPVATO/x3ZLTsOsKT8FrT+6zys2LVmZDjyT9vq5rW8niYKBcCmtU7jr/FMNlVtxWY9LLgUqn2HU0I2pKbD6A==
    // IDHTML.jsx:79 Encrytped Secret key...
    // IDHTML.jsx:80 U2FsdGVkX1/SEmTxVYsxgOLc5VBhFyHtc1tRK4ltCApZBk5Krj2odYbV6ZHN4NMumjZchASC+GTCFgYe2Q1c+VMDFnXNWgwB0oYT3hvAZhdt0Cx+eVkdgOoAxfBKXn8UeqNqfeihHGVFAeaCO8h8Jw==
    // IDHTML.jsx:81 Password...
    // IDHTML.jsx:82 andrew

    /* --------- */

    console.log('All prop data');
    console.log(this.props.data);

    let signature;
    let hashOfFile;
    let secretKey;
    let verificationMessage;
    try {
      hashOfFile = CryptoJS.SHA3(this.props.data.fileAsBase64).toString(CryptoJS.enc.base64);
      secretKey = CryptoJS.AES.decrypt(this.props.data.encryptedSecretKey, this.props.data.password).toString(CryptoJS.enc.Utf8);
      signature = tweetnacl.sign.detached(tweetnacl.util.decodeUTF8(hashOfFile), tweetnacl.util.decodeBase64(secretKey));
      verificationMessage = tweetnacl.sign.detached.verify(tweetnacl.util.decodeUTF8(hashOfFile), signature, tweetnacl.util.decodeBase64(this.props.data.publicKey)) ? 'Verified on creation' : 'Verification failed';
    }
    catch(err) {
      this.setState({error: err.toString()});
      return;
    }

    let messageToHZ = JSON.stringify({
      hashOfFile: hashOfFile,
      publicKey: this.props.data.publicKey,
      signature: tweetnacl.util.encodeBase64(signature),
      estonianID: this.props.data.estonianID
    });

    // send data to HZ
    //$.post( "https://bitnation.co/notary/api/server-req.php", { message: encodeURIComponent(messageToHZ) }, function( data ) {

    //console.log(data);

    this.setState({
      hashOfFile: hashOfFile,
      secretKey: secretKey,
      signature: tweetnacl.util.encodeBase64(signature),
      dataSentToHZ: true,
      messageToHZ: messageToHZ,
      //nhzTx: data.transaction,
      nhzTx: 12341234543,
      verificationMessage: verificationMessage,
      timestamp: 'today'
      //timestamp: (new Date(Date.UTC(2014, 2, 22, 22, 22, 0, 0) + data.transactionJSON.timestamp * 1000)).toLocaleString()
    });

    //  }.bind(this), 'json');
  }

  downloadZippedFiles() {
    const zip = new JSZip();
    zip.file(this.props.data.inputFilename, this.props.data.fileAsBase64, { base64: true });
    const content = zip.generate({ type: 'blob' });
    saveAs(content, "bitnation-notary-service.zip");
  }

  render() {
    let content;

    if (this.state.error !== null) {
      content = (
        <Alert bsStyle="danger" className="text-center">
          <p>Looks like there was an issue in decrypting your encrypted key with your password.</p>
          <h4>{this.state.error}</h4>
          <p>Please check your password and keys, refresh and try again.</p>
        </Alert>
      );
    } else if (!this.state.dataSentToHZ) {
      content = <h3 className="text-center"><i className="fa fa-spin fa-3x fa-cog"></i><br/>Generating signature...</h3>;
      } else {
        content = (
          <Row className="text-center confirmation">
            <Col md={8} mdOffset={2}>
              <h1>Digital Signature Certificate</h1>
              <p>For a file with the hash</p>
              <h4>{this.state.hashOfFile}</h4>
              <p>and the public key</p>
              <h4>{this.props.data.publicKey}</h4>
              <p>resulting in the legally binding digital signature</p>
              <h4>{this.state.signature}</h4>
              <p>and horizon blockchain timestamp</p>
              <h4>{this.state.nhzTx}</h4>
              <hr />
              <p>This completes the verification data</p>
              <Alert bsStyle="success">
                { this.state.verificationMessage }
              </Alert>
              <p>Date: { this.state.timestamp }</p>
              <p>Estonian ID # { this.props.data.estonianID }</p>
              <Button
                bsStyle="success"
                bsSize="large"
                onClick={this.downloadZippedFiles.bind(this)}
                >
                Download Files
              </Button>
            </Col>
          </Row>
        );
      }

      return (
        <div>
          { content }
        </div>
      );
    }
  }

  export default NotaryConfirmation;
