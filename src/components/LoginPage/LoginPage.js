import { React, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Form, Link } from '@carbon/react';
import { DBOperations } from "../../Db/DBOperations";
import AppContext from "../../Context/AppContext";
import { LOGIN } from "../../Context/action.types";
import SignupInput from "../SignupInput/SignupInput";
import "./_login-page.scss";

const LoginPage = () => {

    const { dispatch, userInfo } = useContext(AppContext);
    const dbOpearations = new DBOperations();
    const navigate = useNavigate();
    const [user] = useState({ fullName: "", email: "", password: "", id: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const goToSignup = () => {
        navigate("/signup");
    };

    //login using firebase email and password authentication
    const handleLogin = () => {
        dbOpearations.loginWithEmailAndPassword(userInfo.email, userInfo.password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({ type: LOGIN });
                setErrorMessage("");
                navigate("/landing", { state: { name: user.email } });
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <Form className="login_form" onSubmit={handleSubmit}>
            <Stack className="login_stack" gap={7} >
                <h2>Login</h2>
                <SignupInput errorMessage={errorMessage} isLogin={true} user={user} />
                <Button
                    className="btn-login"
                    kind="primary"
                    tabIndex={0}
                    type="submit">
                    Login
                </Button>
                <p>Not a registered user ? <Link onClick={goToSignup}> SignUp </Link></p>
            </Stack>
        </Form >
    )
};

export default LoginPage;