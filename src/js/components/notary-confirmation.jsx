import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
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

    // let keyPair = tweetnacl.sign.keyPair();
    // let publicKey = tweetnacl.util.encodeBase64(keyPair.publicKey);
    // let signature = tweetnacl.util.encodeBase64(tweetnacl.sign.detached(tweetnacl.util.decodeUTF8(certData), keyPair.secretKey));
    // let secretKey = tweetnacl.util.encodeBase64(keyPair.secretKey);
    // let encryptedSecretKey = CryptoJS.AES.encrypt(secretKey, this.props.data.password).toString();


    // FOR TESTING
    // Encrytped Secret key...
    // IDHTML.jsx:80 U2FsdGVkX19Ym8yWYq1hiMR39oVPrVEJ2TNCsf40IOJqaQ/1RphzhRj5GAz3ep06JUOgTyKiFkYQAdIztFJgwGwLw4uVmcI1zC8CaancK9jFlZypYxUXmY2hyUHhdBi4jfOkSDjQu45NbKjFK2t/bg==
    // IDHTML.jsx:81 Password...
    // IDHTML.jsx:82 andrew



    /* --------- */

    let hashOfFile = tweetnacl.hash(tweetnacl.util.decodeBase64(this.props.data.fileAsBase64.split(',')[1]));
    console.log('hashoffile...')
    console.log(hashOfFile);
    console.log(tweetnacl.util.encodeBase64(hashOfFile));
    console.log('encrypted secret key...');
    console.log(this.props.data.encryptedSecretKey);
    console.log('password...');
    console.log(this.props.data.password);
    let secretKey = CryptoJS.AES.decrypt(this.props.data.encryptedSecretKey, this.props.data.password).toString(CryptoJS.enc.Utf8);
    console.log('secret key...')
    console.log(secretKey);
    console.log(this.props.data);

    let signature = null;
    try {
      signature = tweetnacl.util.encodeBase64(tweetnacl.sign.detached(hashOfFile, tweetnacl.util.decodeBase64(secretKey)));
    }
    catch(err) {
      console.log(err.message);
    }

    this.setState({
      hashOfFile: tweetnacl.util.encodeBase64(hashOfFile),
      secretKey: secretKey,
      signature: signature,
      dataSentToHZ: true
    });

    // // get user entered details
    // let certData = JSON.stringify({
    // name: this.props.data.name,
    // dateOfBirth: this.props.data.dob,
    // height: this.props.data.height + 'cm',
    // witness1: this.props.data.witness1,
    // witness2: this.props.data.witness2,
    // imageHash: tweetnacl.util.encodeBase64(tweetnacl.hash(tweetnacl.util.decodeBase64(this.props.data.image.split(',')[1])))
    // });
    //
    // // do the encryption

    //
    // // verifying signature and encrypted key
    // let signatureVerified = tweetnacl.sign.detached.verify(tweetnacl.util.decodeUTF8(certData), tweetnacl.util.decodeBase64(signature), tweetnacl.util.decodeBase64(publicKey));
    // let encryptedKeyCheck = (CryptoJS.AES.decrypt(encryptedSecretKey, this.props.data.password).toString(CryptoJS.enc.Utf8) === secretKey);
    // let verificationMessage = (signatureVerified && encryptedKeyCheck) ? 'Verified on generation' : 'Error in verification';
    //
    // // send data to HZ
    // $.post( "api/server-req.php", { message: encodeURIComponent(`${signature}:${publicKey}`) }, function( data ) {
    //
    // let verificationData = JSON.stringify({
    // publicKey: publicKey,
    // signature: signature,
    // nhzTx: data.transaction
    // });
    //
    // this.setState({
    // certData: certData,
    // verificationData: verificationData,
    // encryptedSecretKey: encryptedSecretKey,
    // verificationMessage: verificationMessage,
    // dataSentToHZ: true
    // });
    // }.bind(this), 'json');

  }

  render() {

    console.log('state..');
    console.log(this.state);

    var content;

    if(this.state.signature === null) {
      content = <h3>Problem decrypting encrypted secret key with your password. Please refresh and try again.</h3>
    } else if(!this.state.dataSentToHZ) {
      content = <h3 className="text-center"><i className="fa fa-spin fa-3x fa-cog"></i><br/>Generating signature...</h3>;
      }
      else {
        content =
        <div>
          <h1>Details</h1>
          <table className="table">
            <tr><td>file as base64</td><td>{this.props.data.fileAsBase64}</td></tr>
            <tr><td>hash of file</td><td>{this.state.hashOfFile}</td></tr>
            <tr><td>Secret key (encrypted)</td><td>{this.props.data.encryptedSecretKey}</td></tr>
            <tr><td>Secret key (unencrypted)</td><td>{this.state.secretKey}</td></tr>
            <tr><td>Signature of hash of file</td><td>{this.state.signature}</td></tr>
            <tr><td>Public key</td><td>{this.props.data.publicKey}</td></tr>
          </table>
        </div>;
      }
      //
      // if(!this.state.dataSentToHZ) {
      //   content = <h3 className="text-center"><i className="fa fa-spin fa-3x fa-cog"></i><br/>Generating ID...</h3>;
      //   }
      //   else {
      //     content = <h2>hello</h2>;
      //     }

      return (
        <div>
          { content }
        </div>
      );
    }
  }

  export default NotaryConfirmation;
