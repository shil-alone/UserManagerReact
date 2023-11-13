import { React, useContext, useState, useEffect } from "react";
import { Content } from "@carbon/react";
import Toaster from "../Toaster/Toaster";
import UserTable from "../UserTable/UserTable";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import { getTimeData } from "../../Utils/utils";
import { headerData } from "../../Db/data";
import AppContext from "../../Context/AppContext";
import "./_home-page.scss";

// when we click on delete and all the data in that page deleted then it shows empty value bug
// search only happens on current page

const HomePage = () => {

    const { isLoggedIn } = useContext(AppContext);
    const [toastList, setToastList] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            setToastList([...toastList, { subtitle: "User logged in successfully" }]);
        }
    }, []);

    return (
        <Content className="landing_page">
            <HeaderComponent />
            <div className="table_content">
                <UserTable headerData={headerData} />
                {isLoggedIn ?
                    <div className="notification-container">
                        {toastList.map((toast, index) => (
                            <Toaster key={index} subtitle={toast.subtitle} {...getTimeData()} />
                        ))}
                    </div> : <></>}
            </div>
        </Content>
    )
};

export default HomePage;