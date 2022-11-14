import { createStore, combineReducers } from "redux";
// import favoriteReducer from '../src/reducers/favoriteReducer';
import userReducer from "../redux/reducers/userReducer";
import placesReducer from "../redux/reducers/placesReducer";
import tasksReducer from "../redux/reducers/tasksReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  blackList: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  user_places: placesReducer,
  user_tasks: tasksReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
