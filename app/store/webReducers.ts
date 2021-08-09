import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import history from '@utils/history';

// import { authReducer, initialState as authInitialState } from '@common/redux/auth/reducer';

// import { authActions } from '@redux/auth/actions';

import { connectRouter } from 'connected-react-router';

const userPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['isAuthenticated', 'response'],
    blacklist: ['loaders', 'errors']
};

const reducer = combineReducers({
    router: connectRouter(history),
    // auth: persistReducer(userPersistConfig, authReducer),
});

const resetToIntialState = (state: any) => ({
    ...state,
    // auth: authInitialState,
});

// to clear redux after user triggers logout
export default (state: any, action: any) => {
    // if (action.type === authActions.CLEAR_USER) {
    //     return resetToIntialState(state);
    // }
    return reducer(state, action);
};
