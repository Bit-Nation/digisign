import React, { Component } from 'react';
import { Grid, Row, Col, Input, ButtonInput, Alert } from 'react-bootstrap';
import { Form, ValidatedInput } from 'react-bootstrap-validation';

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
  /* -------------------------- */

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
              <ButtonInput className='center-block' type='submit' value='Sign my file' bsStyle='primary' bsSize='large'/>
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default NotaryForm;
