import React, { Component } from 'react';
import { Grid, Row, Col, Input, ButtonInput } from 'react-bootstrap';
import { Form, ValidatedInput } from 'react-bootstrap-validation';

class Notary extends Component {

  constructor() {
    super();
    this.state = {
      publicKey: '',
      secretKey: '',
      password: '',
      hashOfFile: ''
    };
  }

  /* Handle the form submission */
  /* -------------------------- */

  handleValidSubmit(values) {
    console.log('doing something...');
    console.log(values);
  }

  handleInvalidSubmit(errors, values) {

    console.log(errors)
  }

  /* Process the uploaded image */
  /* -------------------------- */

  handleFile(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    if (!file) return;

    reader.onload = function(inputFile) {
      console.log(inputFile);
      console.log(inputFile.target.result);
    }.bind(this);
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col sm={6}>
            <h1>Digisign<br/><small>Digitally sign any file</small></h1>
          </Col>
        </Row>
        <hr/>

        <Form onValidSubmit={this.handleValidSubmit.bind(this)}
          onInvalidSubmit={this.handleInvalidSubmit.bind(this)}>
          <Row>
            <Col md={4} mdOffset={4}>
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
                name='secretKey'
                validate='required'
                errorHelp='Please paste in your secret key here'
                />
              <ValidatedInput
                type='password'
                name='password'
                label='Password'
                help='The password that was used to encrypt your private key.'
                errorHelp='Please enter the password you used to encrypt your secret key'
                />
              <ButtonInput className='center-block' type='submit' value='Sign my file' bsStyle='primary' bsSize='large'/>
            </Col>
          </Row>
        </Form>

      </Grid>
    );
  }
}

export default Notary;
