import './App.css';
import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Header from './Components/Header/header';
import Home from './Components/Home/home';
import Footer from './Components/Footer/footer';
import CreateInvoice from './Components/CreateInvoice/createinvoice';
import ShowInvoice from './Components/ShowInvoice/showinvoice';
import AddItem from './Components/AddItem/additem';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <div className='p-3 my-2'>
            <Route exact path='/'><Home /></Route>
            <Route exact path='/create_invoice'><CreateInvoice /></Route>
            <Route exact path='/add_item'><AddItem /></Route>
            <Route exact path='/invoice/:invoice_id'><ShowInvoice /></Route>
          </div>
          <Route><div>404 NOT FOUND</div> </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
