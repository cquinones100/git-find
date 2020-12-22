import ReactDOM from 'react-dom';
import React from 'react'
import App from './App';

const rootElement = document.querySelector('div#root');

ReactDOM.render(
  <App />,
  rootElement
);

export default () => {
  ReactDOM.render(
    <App />,
    rootElement
  );
};
