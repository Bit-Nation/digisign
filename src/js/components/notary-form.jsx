import React, { Component } from 'react';
import { Grid, Row, Col, Input, ButtonInput, Alert } from 'react-bootstrap';
import { Form, ValidatedInput } from 'react-bootstrap-validation';
import tweetnacl from 'tweetnacl';
import CryptoJS from 'crypto-js';

class NotaryForm extends Component {

  constructor() {
    super();
    this.state = {
      fileAsBase64: null
    };
  }

  /* Handle the form submission */
  /* -------------------------- */

  handleValidSubmit(values) {
    values['fileAsBase64'] = this.state.fileAsBase64;
    this.props.saveNotaryValues(values);
  }

  handleInvalidSubmit(errors, values) {
    console.log(errors)
  }

  /* Process the uploaded file */
  /* ------------------------- */

  generateKeys() {
    console.log('generating keys...');
    let keyPair = tweetnacl.sign.keyPair();
    let publicKey = tweetnacl.util.encodeBase64(keyPair.publicKey);
    let secretKey = tweetnacl.util.encodeBase64(keyPair.secretKey);
    let encryptedSecretKey = CryptoJS.AES.encrypt(secretKey, 'superfreak').toString();
    console.log(publicKey);
    console.log(secretKey);
    console.log(encryptedSecretKey);
  }

  /* Process the uploaded file */
  /* ------------------------- */

  handleFile(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    if (!file) return;

    reader.onload = function(inputFile) {
      this.state.fileAsBase64 = inputFile.target.result;
    }.bind(this);
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={6} mdOffset={3} className="text-center">
            <h1>Digisign<small> - Digitally sign any file</small></h1>
          </Col>
        </Row>
        <hr/>
        <Form onValidSubmit={this.handleValidSubmit.bind(this)}
          onInvalidSubmit={this.handleInvalidSubmit.bind(this)}>
          <Row>
            <Col md={6} mdOffset={3}>
              <Input
                type='file'
                label='Upload a file to sign'
                onChange={this.handleFile.bind(this)}
                required
                />
              <p>Don't have your own keys? Generate a once-off pair by clicking <a href="#" onClick={this.generateKeys} >here</a>.</p>
              <ValidatedInput
                type='text'
                label='Your public key'
                name='publicKey'
                validate='required'
                errorHelp='Please paste in your public key here'
                />
              <ValidatedInput
                type='text'
                label='Your encrypted secret key'
                name='encryptedSecretKey'
                validate='required'
                errorHelp='Please paste in your secret key here'
                />
              <ValidatedInput
                type='password'
                name='password'
                label='The password you used to encrypt your secret key'
                errorHelp='Please enter the password you used to encrypt your secret key'
                required
                />
              <ValidatedInput
                type='text'
                label='Document number (e-ID)'
                name='estonianID'
                />
              <ButtonInput className='center-block' type='submit' value='Sign my file' bsStyle='primary' bsSize='large'/>
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default NotaryForm;
