import { createStore, applyMiddleware } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./stores/reducers/rootReducer";
import { persistStore } from "redux-persist";
import { AnyAction } from "redux";

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

const reduxStore = () => {
    const store = createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(thunk))
    );
    const persistor = persistStore(store);
    return { store, persistor };
};

export default reduxStore;
