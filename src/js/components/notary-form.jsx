import React, { Component } from 'react';
import { Grid, Row, Col, Input, ButtonInput } from 'react-bootstrap';
import { Form, ValidatedInput } from 'react-bootstrap-validation';
import tweetnacl from 'tweetnacl';
import CryptoJS from 'crypto-js';

class NotaryForm extends Component {

  constructor() {
    super();
    this.state = {
      publicKey: '',
      encryptedSecretKey: '',
      password: ''
    };

    this.fileObject = {};
  }

  // handle the change for every input field (controlled components)
  handleChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  /* Handle the form submission */
  /* -------------------------- */

  handleValidSubmit(values) {
    // values['fileAsBase64'] = this.state.fileAsBase64;
    this.props.saveNotaryValues(Object.assign({}, values, this.fileObject));
  }

  handleInvalidSubmit(errors, values) {
    console.log(errors)
  }

  /* Process the uploaded file */
  /* ------------------------- */

  generateKeys() {
    // console.log('generating keys...');
    const keyPair = tweetnacl.sign.keyPair();
    const publicKey = tweetnacl.util.encodeBase64(keyPair.publicKey);
    const secretKey = tweetnacl.util.encodeBase64(keyPair.secretKey);
    const encryptedSecretKey = CryptoJS.AES.encrypt(secretKey, 'superfreak').toString();
    // console.log(publicKey);
    // console.log(secretKey);
    // console.log(encryptedSecretKey);
    this.setState({ publicKey: publicKey, encryptedSecretKey: encryptedSecretKey, password: 'superfreak' });
  }

  /* Process the uploaded file */
  /* ------------------------- */

  handleFile(e) {
    const reader = new FileReader();
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) return;

    reader.onload = function(inputFile) {
      this.fileObject = {
        fileAsBase64: inputFile.target.result,
        inputFilename: uploadedFile.name
      };
    }.bind(this);
    reader.readAsArrayBuffer(uploadedFile);
  }

  render() {
    return (
      <Grid>
        <Form onValidSubmit={this.handleValidSubmit.bind(this)}
          onInvalidSubmit={this.handleInvalidSubmit.bind(this)}>
          <Row>
            <Col md={6} mdOffset={3}>
              <Input
                type='file'
                label='Upload a file to sign (PDF or JPEG)'
                accept='.jpg,.pdf,.jpeg'
                onChange={this.handleFile.bind(this)}
                required
                />
              <p>Don't have your own keys? Generate a once-off pair by clicking <a href="#" onClick={this.generateKeys.bind(this)} >here</a>.</p>
              <ValidatedInput
                type='text'
                label='Your public key'
                name='publicKey'
                validate='required'
                errorHelp='Please paste in your public key here'
                value={this.state.publicKey}
                onChange={this.handleChange.bind(this)}
                />
              <ValidatedInput
                type='text'
                label='Your encrypted secret key'
                name='encryptedSecretKey'
                validate='required'
                errorHelp='Please paste in your secret key here'
                value={this.state.encryptedSecretKey}
                onChange={this.handleChange.bind(this)}
                />
              <ValidatedInput
                type='password'
                name='password'
                label='The password you used to encrypt your secret key'
                errorHelp='Please enter the password you used to encrypt your secret key'
                required
                value={this.state.password}
                onChange={this.handleChange.bind(this)}
                />
              <ValidatedInput
                type='text'
                label='Estonian e-Resident number (optional)'
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
