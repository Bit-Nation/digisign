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
        { content }
        <hr />
        <footer>
          <p className="text-center"><a href="https://bitnation.co/">Bitnation</a> digital signature notary service</p>
        </footer>
      </Grid>
    );
  }
}

export default Notary;
