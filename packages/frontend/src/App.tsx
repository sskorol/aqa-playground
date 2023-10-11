import React from 'react';
import './App.css';
import Main from './components/MainComponent/Main';
import { observer } from 'mobx-react-lite';
import authStore from './stores/AuthStore';
import { Login } from './components/LoginComponent/Login';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { SignUp } from './components/SignUpComponent/SignUp';
import NewProduct from './components/ProductComponent/NewProduct';

const App: React.FC = observer(() => {
  const { isLoggedIn } = authStore;

  return (
    <BrowserRouter>
      <div
        className={`App ${
          isLoggedIn ? 'App-main-container' : 'App-login-container'
        }`}
      >
        <Routes>
          <Route
            path='/'
            element={isLoggedIn ? <Main /> : <Navigate to='/login' />}
          />
          <Route
            path='/login'
            element={
              <div>
                <Login />
              </div>
            }
          />
          <Route
            path='/signup'
            element={
              <div>
                <SignUp />
              </div>
            }
          />
          <Route path='/new-product' element={<NewProduct />} />
          <Route
            path='/*'
            element={<Navigate to={isLoggedIn ? '/' : '/login'} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
});

export default App;
