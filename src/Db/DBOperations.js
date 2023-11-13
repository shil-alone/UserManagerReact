import { getDatabase, ref, update, set, get, child } from "firebase/database";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { initializeApp } from "firebase/app";

class DBOperations {

    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.database = getDatabase(this.app);
        this.auth = getAuth();
    }

    #userList = [];
    //getting users data from firebase realtime database
    getUsersFromDb = async () => {
        const dataRef = ref(this.database);
        const snapshot = await get(child(dataRef, '/users'));
        this.userList = [];
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const key in users) {
                if (users.hasOwnProperty(key)) {
                    this.#userList.push(users[key]);
                }
            }
            return this.#userList;
        } else {
            console.log("No data available");
        }
        return this.#userList;
    };

    // storing user information into firebase realtime database
    writeUserDataInDb = async (userId, email, fullName) => {
        await set(ref(this.database, 'users/' + userId), {
            id: userId,
            email: email,
            fullName: fullName
        });
    };

    // creating new user into the firebase realtime database and firebase authentication
    addUserInDb = async (email, password) => {
        // signup using firebase email and password authentication
        // it return user credentials
        return await createUserWithEmailAndPassword(this.auth, email, password)
    };

    loginWithEmailAndPassword = async (email, password) => {
        // login using firebase email and password authentication
        // it returns user credentials
        return await signInWithEmailAndPassword(this.auth, email, password);
    }

    // updating user data in realtime database
    updateUserInDb = async (user) => {
        let userObject = {};
        userObject[user.id] = user;
        await update(ref(this.database, "users/"), userObject);
    };

    // delete multiple users from database
    deleteUsersFromDb = async (selectedRows) => {
        const uidListObject = {};
        selectedRows.map((user) => {
            uidListObject[user.id] = null;
        });
        await update(ref(this.database, "users/"), uidListObject);
    };

    // logout using firebase authentication
    logoutUser = async () => {
        await signOut(this.auth);
    };
}

export { DBOperations };