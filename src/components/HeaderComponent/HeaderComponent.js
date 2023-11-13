import React, { useContext, useState } from 'react';
import { Header, HeaderName, HeaderGlobalAction, HeaderGlobalBar, Theme, Modal } from "@carbon/react";
import { Search, Switcher, Login, UserFollow } from "@carbon/icons-react";
import { DBOperations } from '../../Db/DBOperations';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import { LOGOUT } from '../../Context/action.types';

const HeaderComponent = () => {

    const { dispatch } = useContext(AppContext);
    const dbOperations = new DBOperations();
    const navigate = useNavigate();
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    // logout using firebase authentication
    const logout = async () => {
        await dbOperations.logoutUser();
        setOpenLogoutModal(false);
        dispatch({ action: LOGOUT });
        navigate("/");
    };

    return (
        <div>
            {/* header with navigation and global actions */}
            <Theme theme="g100">
                <Header aria-label="User Manager Platform Name">
                    <HeaderName href="#" prefix="User Manager">
                        [React App]
                    </HeaderName>
                    <HeaderGlobalBar>
                        <HeaderGlobalAction aria-label="Search" onClick={() => { }}>
                            <Search />
                        </HeaderGlobalAction>
                        <HeaderGlobalAction aria-label="Add User" onClick={() => {
                        }}>
                            <UserFollow />
                        </HeaderGlobalAction>
                        <HeaderGlobalAction aria-label="Logout" onClick={() => {
                            setOpenLogoutModal(true);
                        }}>
                            <Login />
                        </HeaderGlobalAction>
                        <HeaderGlobalAction aria-label="App Switcher" onClick={() => { }}>
                            <Switcher />
                        </HeaderGlobalAction>
                    </HeaderGlobalBar>
                </Header>
            </Theme>


            {/* logout modal  */}
            <Modal
                open={openLogoutModal}
                onRequestClose={() => { setOpenLogoutModal(false); }}
                onRequestSubmit={() => { logout() }}
                size="xs"
                modalHeading="Are You Sure To Logout ?"
                primaryButtonText="Logout"
                secondaryButtonText="Cancel">
                <p style={{ marginBottom: '1rem' }}>
                    Clicking on the logout button will be logged out from this application. Click cancel to stay logged in.
                </p>
            </Modal>
        </div>
    )
}

export default HeaderComponent;