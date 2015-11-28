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

    //     Public key...
    // IDHTML.jsx:73 vJ4mCgXAprVO46/xTDZVbcVmPSy4FKp9h1NCNqSmw+g=
    // IDHTML.jsx:76 Secret key...
    // IDHTML.jsx:77 R5xPVATO/x3ZLTsOsKT8FrT+6zys2LVmZDjyT9vq5rW8niYKBcCmtU7jr/FMNlVtxWY9LLgUqn2HU0I2pKbD6A==
    // IDHTML.jsx:79 Encrytped Secret key...
    // IDHTML.jsx:80 U2FsdGVkX1/SEmTxVYsxgOLc5VBhFyHtc1tRK4ltCApZBk5Krj2odYbV6ZHN4NMumjZchASC+GTCFgYe2Q1c+VMDFnXNWgwB0oYT3hvAZhdt0Cx+eVkdgOoAxfBKXn8UeqNqfeihHGVFAeaCO8h8Jw==
    // IDHTML.jsx:81 Password...
    // IDHTML.jsx:82 andrew


    //message: tt7RKnxJOFWoLnAqS1ca0jH1vDauQTBQcKpITySWNC2yBzmkp8BElNZvcpBJ9ONj+b04sCUZocFrVgsTgD+Vmw==
    // signature: hcKhaTMGyhBGGwIcTiHa2v5Way9F/vW5zz7Barmw+/mgwY5nG/Gs/mqnkYrp1uXv1gRwmNe+BR78tX59ujzDBw==


    /* --------- */

    console.log('Sex is fun');
    let hashOfFile = CryptoJS.SHA3(this.props.data.fileAsBase64).toString(CryptoJS.enc.base64); //,tweetnacl.util.encodeBase64(tweetnacl.hash(tweetnacl.util.decodeBase64(this.props.data.fileAsBase64)));
    console.log('The hash....');
    console.log(hashOfFile);
    console.log('encrypted secret key...');
    console.log(this.props.data.encryptedSecretKey);
    console.log('password...');
    console.log(this.props.data.password);
    let secretKey = CryptoJS.AES.decrypt(this.props.data.encryptedSecretKey, this.props.data.password).toString(CryptoJS.enc.Utf8);
    console.log('secret key...')
    console.log(secretKey);
    //console.log(tweetnacl.util.decodeUTF8(secretKey));
    // console.log('hashoffile...')
    // console.log('utf8');
    // console.log(tweetnacl.util.encodeUTF8(hashOfFile));

    let signature = null;
    try {
      signature = tweetnacl.util.encodeBase64(tweetnacl.sign.detached(tweetnacl.util.decodeUTF8(hashOfFile), tweetnacl.util.decodeBase64(secretKey)));
      console.log('just created signature...');
      console.log(signature)
    }
    catch(err) {
      console.log(err.message);
    }

    let messageToHZ = JSON.stringify({
      hashOfFile: hashOfFile,
      publicKey: this.props.data.publicKey,
      signature: signature
    });

    // send data to HZ
    $.post( "https://bitnation.co/id/api/server-req.php", { message: encodeURIComponent(messageToHZ) }, function( data ) {

      this.setState({
        hashOfFile: hashOfFile,
        secretKey: secretKey,
        signature: signature,
        dataSentToHZ: true,
        messageToHZ: messageToHZ,
        nhzTx: data.transaction
      });

    }.bind(this), 'json');

    console.log('-----------------');
    let testSecretKey = 'R5xPVATO/x3ZLTsOsKT8FrT+6zys2LVmZDjyT9vq5rW8niYKBcCmtU7jr/FMNlVtxWY9LLgUqn2HU0I2pKbD6A==';
    let testHash = 'w9NTXK7lO1uDhVVdxNmeNnqV2XLu5cJhO5cO/BTCVmE8NmmX3+VCYzJNXPH6dIVj5ZtDnlYzwSmh1h6FK+pWYQ==';
    console.log('test signature...');
    console.log(tweetnacl.util.encodeBase64(tweetnacl.sign(tweetnacl.util.decodeBase64(testHash), tweetnacl.util.decodeBase64(testSecretKey))));
    //     secret key...
    // bundle.js:21 R5xPVATO/x3ZLTsOsKT8FrT+6zys2LVmZDjyT9vq5rW8niYKBcCmtU7jr/FMNlVtxWY9LLgUqn2HU0I2pKbD6A==
    // bundle.js:21 hashoffile...
    // bundle.js:21 RRKRbsC8yfisV4SmiPkN3QHTs5m+6KeZ0COAbIWSaMFoqbwnX/YN5ottIwrTVQM4Nb279a2c7dhIU/L3IJFXJQ==
    // bundle.js:21 just created signature...
    // bundle.js:21 asf4A6D4iQlQP/WcYe36jFyE1b/MHTHo/EdZYiRvhVyJl8JU/mbjlVVYJZWYCiVBRaf4TxMTMd1TFVm4svu7Cw==





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


  }

  render() {

    // console.log('state..');
    // console.log(this.state);

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
          {this.state.messageToHZ}
          {this.state.nhzTx}
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
