import { LOGIN, LOGOUT, UPDATE_EMAIL, UPDATE_PASSWORD, UPDATE_NAME, RESET_USER, UPDATE_ID } from "./action.types";

const LoginReducer = (state, action) => {
    switch (action.type) {
        case LOGIN:
            return true;
        case LOGOUT:
            return false;
    }
    return state;
};

const InputReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_NAME:
            state.fullName = action.payload;
            return state;
        case UPDATE_EMAIL:
            state.email = action.payload;
            return state;
        case UPDATE_PASSWORD:
            state.password = action.payload;
            return state;
        case UPDATE_ID:
            state.id = action.payload;
            return state;
        case RESET_USER:
            state.fullName = "";
            state.email = "";
            state.password = "";
            state.id = "";
            return state;
    }
    return state;
};

export { LoginReducer, InputReducer };