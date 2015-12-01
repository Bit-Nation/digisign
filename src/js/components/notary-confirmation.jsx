import React, { Component } from 'react';
import { Grid, Row, Col, Alert } from 'react-bootstrap';
import tweetnacl from 'tweetnacl';
import CryptoJS from 'crypto-js';
import $ from 'jquery';

class NotaryConfirmation extends Component {

  constructor() {
    super();
    this.state = {
      dataSentToHZ: false
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

    let hashOfFile = CryptoJS.SHA3(this.props.data.fileAsBase64).toString(CryptoJS.enc.base64); //,tweetnacl.util.encodeBase64(tweetnacl.hash(tweetnacl.util.decodeBase64(this.props.data.fileAsBase64)));
    // console.log('The hash....');
    // console.log(hashOfFile);
    // console.log('encrypted secret key...');
    // console.log(this.props.data.encryptedSecretKey);
    // console.log('password...');
    // console.log(this.props.data.password);
    let secretKey = CryptoJS.AES.decrypt(this.props.data.encryptedSecretKey, this.props.data.password).toString(CryptoJS.enc.Utf8);
    // console.log('secret key...')
    // console.log(secretKey);

    let signature = null;
    try {
      signature = tweetnacl.sign.detached(tweetnacl.util.decodeUTF8(hashOfFile), tweetnacl.util.decodeBase64(secretKey));
    }
    catch(err) {
      console.log(err.message);
    }

    let verificationMessage = tweetnacl.sign.detached.verify(tweetnacl.util.decodeUTF8(hashOfFile), signature, tweetnacl.util.decodeBase64(this.props.data.publicKey)) ? 'Verified on creation' : 'Verification failed';

    let messageToHZ = JSON.stringify({
      hashOfFile: hashOfFile,
      publicKey: this.props.data.publicKey,
      signature: tweetnacl.util.encodeBase64(signature),
      estonianID: this.props.data.estonianID
    });

    // send data to HZ
    $.post( "https://bitnation.co/id/api/server-req.php", { message: encodeURIComponent(messageToHZ) }, function( data ) {

      console.log(data);

      this.setState({
        hashOfFile: hashOfFile,
        secretKey: secretKey,
        signature: tweetnacl.util.encodeBase64(signature),
        dataSentToHZ: true,
        messageToHZ: messageToHZ,
        nhzTx: data.transaction,
        verificationMessage: verificationMessage,
        timestamp: (new Date(Date.UTC(2014, 2, 22, 22, 22, 0, 0) + data.transactionJSON.timestamp * 1000)).toLocaleString()
      });

    }.bind(this), 'json');
  }

  render() {

    var content;

    if(this.state.signature === null) {
      content = <h3>Problem decrypting encrypted secret key with your password. Please refresh and try again.</h3>
    } else if(!this.state.dataSentToHZ) {
      content = <h3 className="text-center"><i className="fa fa-spin fa-3x fa-cog"></i><br/>Generating signature...</h3>;
      }
      else {
        content =
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
            <hr/>
            <p>This completes the verification data</p>
            <Alert bsStyle="success">
              { this.state.verificationMessage }
            </Alert>
            <p>Date: { this.state.timestamp }</p>
            <p>Estonian ID # { this.props.data.estonianID }</p>
          </Col>
        </Row>;
      }

      return (
        <div>
          { content }
        </div>
      );
    }
  }

  export default NotaryConfirmation;
