import { React, useState, useContext } from "react";
import { DBOperations } from "../../Db/DBOperations";
import { Button, Stack, Form, Link } from '@carbon/react';
import AppContext from "../../Context/AppContext";
import SignupInput from "../SignupInput/SignupInput";
import { LOGIN } from "../../Context/action.types";
import { useNavigate } from "react-router-dom";
import "../LoginPage/_login-page.scss";

const SignupPage = () => {

    const { dispatch, userInfo } = useContext(AppContext);
    const navigate = useNavigate();
    const dbOpearations = new DBOperations();
    const [errorMessage, setErrorMessage] = useState("");
    const [user] = useState({ fullName: "", email: "", password: "", id: "" });

    const goToLogin = () => {
        navigate("/");
    };

    const handleSignup = () => {
        if (userInfo.fullName == "") {
            setErrorMessage("Please enter your full name");
            return;
        }
        // signup using firebase email and password authentication
        dbOpearations.addUserInDb(userInfo.email, userInfo.password)
            .then((userCredential) => {
                const user = userCredential.user;
                dbOpearations.writeUserDataInDb(user.uid, user.email, userInfo.fullName);
                dispatch({ type: LOGIN });
                navigate("/landing", { state: { name: user.email } });
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSignup();
    };

    return (
        <Form className="login_form" onSubmit={handleSubmit}>
            <Stack gap={7}>
                <h2>SignUp</h2>
                <SignupInput isSignup={true} errorMessage={errorMessage} user={user} />
                <Button
                    className="btn-login"
                    kind="primary"
                    tabIndex={0}
                    type="submit">
                    SignUp
                </Button>
                <p>Already registered user ? <Link onClick={goToLogin}> Login </Link></p>
            </Stack>
        </Form>
    )
};

export default SignupPage;