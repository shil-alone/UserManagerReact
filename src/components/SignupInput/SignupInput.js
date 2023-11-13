import React, { useContext, useEffect, useState } from 'react';
import { Stack, TextInput, InlineNotification } from '@carbon/react';
import { UPDATE_EMAIL, UPDATE_NAME, UPDATE_PASSWORD } from '../../Context/action.types';
import AppContext from '../../Context/AppContext';

const SignupInput = ({ isAddUser, isSignup, isLogin, errorMessage, user }) => {

    const { dispatchUserInfo } = useContext(AppContext);
    const [userData, setUserData] = useState({ fullName: "", email: "", password: "", id: "" });

    const onNameChange = (e) => {
        dispatchUserInfo({ type: UPDATE_NAME, payload: e.target.value });
        setUserData({ ...userData, fullName: e.target.value })
    };
    const onEmailChange = (e) => {
        dispatchUserInfo({ type: UPDATE_EMAIL, payload: e.target.value });
        setUserData({ ...userData, email: e.target.value })
    };
    const onPasswordChange = (e) => {
        dispatchUserInfo({ type: UPDATE_PASSWORD, payload: e.target.value });
        setUserData({ ...userData, password: e.target.value })
    };

    useEffect(() => {
        setUserData({ fullName: user.fullName, email: user.email, password: user.password, id: user.id });
    }, [user]);

    return (
        <Stack gap={7}>
            {!isLogin ? <TextInput
                id="username"
                type="text"
                invalidText="Invalid error message."
                labelText="Full name"
                placeholder="Enter full name here"
                onChange={onNameChange}
                value={userData.fullName}
                disabled={false} invalid={false} />
                : <></>}

            <TextInput
                id="email"
                type="text"
                invalidText="Invalid error message."
                labelText="Email"
                placeholder="Enter email here"
                onChange={onEmailChange}
                value={userData.email}
                disabled={false} invalid={false} />

            {isAddUser || isSignup || isLogin ? <TextInput
                helperText=""
                type="password"
                id="password"
                invalidText="Invalid error message."
                labelText="Password"
                placeholder="Enter password here"
                onChange={onPasswordChange}
                value={userData.password}
                disabled={false} invalid={false} />
                : <></>}

            {(errorMessage ? <InlineNotification
                kind="error"
                iconDescription="describes the close button"
                subtitle={errorMessage}
                title="Signup error"
                hideCloseButton
            /> : <></>)}
        </Stack>
    )
}

export default SignupInput;