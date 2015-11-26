/* pseudo code */
/*
so maybe

screen 1) upload file, screen

2) enter keypair


like (insert keypair from file, or paste them) and (I dont have them/dont understand what it is --  so generate)

screen 3) enter password ….


--> which generates us a JSON object {1) the hash of the file 2) the signing of the hash by the secret key 3) the public key}

the final page will display that JSON object and the tx id


*/

import React from 'react';
import ReactDOM from 'react-dom';
import Notary from './components/notary.jsx';

window.onload = function() {
  ReactDOM.render(
    <Notary />,
    document.getElementById('root')
  )
}
