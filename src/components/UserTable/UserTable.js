import { useState, useEffect, useContext } from 'react';
import {
    Button, DataTable, TableContainer, TableBatchActions, TableBatchAction, TableToolbarSearch,
    TableToolbarContent, TableToolbar, Table, TableHead, TableRow, TableHeader, TableBody, TableSelectAll,
    TableCell, TableSelectRow, DataTableSkeleton, Pagination, Modal, InlineLoading
} from "@carbon/react";
import { Edit, TrashCan } from '@carbon/icons-react';
import SignupInput from "../SignupInput/SignupInput";
import { DBOperations } from '../../Db/DBOperations';
import Toaster from "../Toaster/Toaster";
import { getTimeData } from "../../Utils/utils";
import AppContext from '../../Context/AppContext';
import { RESET_USER, UPDATE_EMAIL, UPDATE_ID, UPDATE_NAME } from '../../Context/action.types';

const UserTable = ({ headerData }) => {
    const dbOperations = new DBOperations();
    const { userInfo, dispatchUserInfo } = useContext(AppContext);

    const [user, setUser] = useState({ fullName: "", email: "", password: "", id: "" });
    const [totalUserList, setTotalUserList] = useState([]);
    const [deleteUserList, setDeleteUserList] = useState([]);
    const [toastList, setToastList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [pageNo, setPageNo] = useState(1);

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [openEditUserModal, setOpenEditUserModal] = useState(false);
    const [isAddUser, setIsAddUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const clearData = () => {
        dispatchUserInfo({ type: RESET_USER });
        setUser({ fullName: "", email: "", password: "", id: "" });
        setErrorMessage("");
    };

    //getting users data from firebase realtime database
    const getUsers = async () => {
        setTotalUserList(await dbOperations.getUsersFromDb());
        setUserList(paginate({ page: pageNo, pageSize: 7 }));
        setIsDataLoaded(true);
    };

    // storing user information into firebase realtime database
    const writeUserData = async (userId, email, fullName) => {
        await dbOperations.writeUserDataInDb(userId, email, fullName);
        setToastList([...toastList, { subtitle: "User added successfully" }]);
        clearData();
        setIsLoading(false);
        getUsers();
    };

    // creating new user into the firebase realtime database and firebase authentication
    const addUser = () => {
        if (userInfo.fullName == "") {
            setErrorMessage("Please enter your full name");
            setIsLoading(false);
            return;
        }
        // signup using firebase email and password authentication
        dbOperations.addUserInDb(userInfo.email, userInfo.password)
            .then((userCredential) => {
                writeUserData(userCredential.user.uid, userCredential.user.email, userInfo.fullName);
                setOpenAddUserModal(false);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setIsLoading(false);
            });
    };

    // updating user data in realtime database
    const updateUser = async (user) => {
        await dbOperations.updateUserInDb(user);
        setOpenEditUserModal(false);
        setToastList([...toastList, { subtitle: "User updated successfully" }]);
        clearData();
        getUsers();
    };

    // delete multiple users from database
    const deleteUsers = async (selectedRows) => {
        await dbOperations.deleteUsersFromDb(selectedRows);
        setToastList([...toastList, { subtitle: "User deleted successfully" }]);
        setOpenDeleteUserModal(false);
        setDeleteUserList([]);
        getUsers();
    };

    // method to change page on next page and previous page clicked
    const onPageChanged = (page, pageSize) => {
        setPageNo(page);
        setUserList(paginate({ page, pageSize }));
    };

    // a method to slice the users list according the page size
    const paginate = ({ page, pageSize }) => {
        const start = (page - 1) * pageSize;
        const end = page * pageSize;
        return totalUserList.slice(start, end);
    };

    const showEditUserModal = (row) => {
        setIsAddUser(false);
        setUser({ fullName: row.cells[0].value, email: row.cells[1].value, password: "", id: row.id });
        dispatchUserInfo({ type: UPDATE_NAME, payload: row.cells[0].value });
        dispatchUserInfo({ type: UPDATE_EMAIL, payload: row.cells[1].value });
        dispatchUserInfo({ type: UPDATE_ID, payload: row.id });
        setErrorMessage("");
        setOpenEditUserModal(true);
    };

    const showAddUserModal = () => {
        clearData();
        setIsAddUser(true);
        setOpenAddUserModal(true);
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        setUserList(paginate({ page: pageNo, pageSize: 7 }));
    }, [totalUserList]);

    return (
        <div>
            {/* data table to show user data  */}
            {
                !isDataLoaded ? <DataTableSkeleton
                    showToolbar={true}
                    showHeader={false}
                    columnCount={4} rowCount={6} /> :
                    <>
                        <DataTable headers={headerData} rows={userList}>
                            {({
                                rows,
                                headers,
                                getHeaderProps,
                                getRowProps,
                                getSelectionProps,
                                getBatchActionProps,
                                onInputChange,
                                selectedRows
                            }) => (
                                <TableContainer title="" >
                                    {/* toolbar with search and delete actions  */}
                                    <TableToolbar>
                                        <TableBatchActions {...getBatchActionProps()}>
                                            <TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={TrashCan}
                                                onClick={() => {
                                                    setDeleteUserList(selectedRows);
                                                    setOpenDeleteUserModal(true);
                                                }}
                                            >
                                                Delete
                                            </TableBatchAction>
                                        </TableBatchActions>

                                        <TableToolbarContent>
                                            <TableToolbarSearch
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                onChange={onInputChange} persistent={false}
                                            />
                                            <Button
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                onClick={() => {
                                                    showAddUserModal();
                                                }}
                                                size="sm"
                                                kind="primary">
                                                Add User
                                            </Button>
                                        </TableToolbarContent>
                                    </TableToolbar>

                                    {/* rendering headers and rows */}
                                    <Table useZebraStyles={false}>
                                        <TableHead>
                                            <TableRow>
                                                <TableSelectAll {...getSelectionProps()} />
                                                {headers.map((header) => (
                                                    <TableHeader {...getHeaderProps({ header })}>
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                                <TableHeader>Edit User</TableHeader>
                                                <TableHeader>Delete User</TableHeader>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow {...getRowProps({ row })}>
                                                    <TableSelectRow {...getSelectionProps({ row })} />
                                                    {row.cells.map((cell) => (
                                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                                    ))}
                                                    <TableCell>
                                                        <Edit className="delete_icon" onClick={() => {
                                                            showEditUserModal(row)
                                                        }} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TrashCan className="delete_icon" onClick={() => {
                                                            setDeleteUserList([row]);
                                                            setOpenDeleteUserModal(true);
                                                        }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </DataTable>

                        <Pagination
                            backwardText="Previous page"
                            forwardText="Next page"
                            itemsPerPageText="Items per page:"
                            onChange={({ page, pageSize }) => { onPageChanged(page, pageSize); }}
                            page={1}
                            pageSize={7}
                            pageSizes={[7]}
                            size="lg"
                            totalItems={totalUserList.length}
                            disabled={false}
                        />
                    </>
            }

            {/* delete user modal  */}
            <Modal
                open={openDeleteUserModal}
                onRequestClose={() => { setOpenDeleteUserModal(false) }}
                onRequestSubmit={() => { deleteUsers(deleteUserList); }}
                size="xs"
                modalHeading="Are You Sure To Delete User ?"
                primaryButtonText="Delete"
                secondaryButtonText="Cancel">
                <p style={{ marginBottom: '1rem' }}>
                    Clicking on the delete button will permanently delete user from the database. Click cancel button if you don't want to delete a user.
                </p>
            </Modal>

            {/* add user modal  */}
            <Modal
                aria-label="add user"
                open={openAddUserModal}
                hasScrollingContent={true}
                onRequestClose={() => {
                    setOpenAddUserModal(false);
                    setIsLoading(false);
                }}
                onRequestSubmit={() => {
                    setIsLoading(true);
                    addUser();
                }}
                size="md"
                modalHeading="Add New User"
                primaryButtonText="Add"
                secondaryButtonText="Cancel">
                <SignupInput isAddUser={isAddUser} errorMessage={errorMessage} user={user} />
                {isLoading ? <InlineLoading
                    style={{
                        marginTop: "25px"
                    }}
                    status="active"
                    description="Creating user..."
                /> : <></>}
            </Modal>

            {/* edit user modal*/}
            <Modal
                aria-label="edit"
                open={openEditUserModal}
                hasScrollingContent={false}
                onRequestClose={() => { setOpenEditUserModal(false); }}
                onRequestSubmit={() => {
                    updateUser({ fullName: userInfo.fullName, email: userInfo.email, id: userInfo.id });
                }}
                size="md"
                modalHeading="Edit User"
                primaryButtonText="Update"
                secondaryButtonText="Cancel">
                <SignupInput isAddUser={isAddUser} errorMessage={errorMessage} user={user} />
            </Modal>

            <div className="notification-container">
                {toastList.map((toast, index) => (
                    <Toaster key={index} subtitle={toast.subtitle} {...getTimeData()} />
                ))}
            </div>
        </div >
    )
}

export default UserTable;