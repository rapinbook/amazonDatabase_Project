import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';
import { Provider, connect} from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './reducers/map.js'
import rootReducer from './reducers/reducers.js';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

var store = createStore(rootReducer);

ReactDOM.render(<Provider store={store}>
      <App/>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
