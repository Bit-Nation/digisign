import React from 'react';
import ReactDOM from 'react-dom';
import Notary from './components/notary.jsx';

window.onload = () => {
  ReactDOM.render(
    <Notary />,
    document.getElementById('root')
  );
};
