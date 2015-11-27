import React, { Component } from 'react';
import { Grid, Row, Col, Input, ButtonInput } from 'react-bootstrap';
import NotaryForm from './notary-form.jsx';
import NotaryConfirmation from './notary-confirmation.jsx';

class Notary extends Component {

  constructor() {
    super();
    this.state = {
      dataEntered: false
    };
  }

  saveNotaryValues(values) {
    this.setState({data: values, dataEntered: true});
  }

  render() {

    let content;

    if(!this.state.dataEntered) {
      content = <NotaryForm saveNotaryValues={this.saveNotaryValues.bind(this)}/>;
    } else {
      content = <NotaryConfirmation data={this.state.data}/>;
    }
    return (
      <Grid>
        <Row>
          <Col sm={6}>
            <img src="https://bitnation.co/wp-content/uploads/2015/08/bitnation-logo.png" />
            <h1>Digisign<small> - Digitally sign any file</small></h1>
          </Col>
        </Row>
        <hr/>
        { content }
        <hr />
        <p className="text-center">App created by <a href="https://bitnation.co/">Bitnation</a></p>
      </Grid>
    );
  }
}

export default Notary;
