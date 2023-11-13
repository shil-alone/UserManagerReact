import { React, useReducer } from 'react';
import { Routes, Route } from "react-router-dom";
import AppContext from "./Context/AppContext";
import { InputReducer, LoginReducer } from "./Context/reducer";
import LandingPage from './components/HomePage/HomePage';
import ErrorPage from "./components/ErrorPage/ErrorPage";
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import firebaseConfig from './Db/firebaseConfig';
import { initializeApp } from "firebase/app";

const App = () => {

  const [userInfo, dispatchUserInfo] = useReducer(InputReducer, { fullName: "", email: "", password: "", id: "" });
  const [isLoggedIn, dispatch] = useReducer(LoginReducer, true);

  //initializing firebase
  initializeApp(firebaseConfig);

  const LoggedOutRoute = () => {
    return (
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    )
  };

  const LoggedInRoute = () => {
    return (
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    )
  };

  return (
    <>
      <AppContext.Provider value={{ isLoggedIn, dispatch, userInfo, dispatchUserInfo }}>
        {isLoggedIn ? <LoggedInRoute /> : <LoggedOutRoute />}
      </AppContext.Provider>
    </>
  )
};

export default App;