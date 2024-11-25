import { StoreEnhancer, configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/rootReducer';
import monitorReducerEnhancer from './middleware/monitorReducerEnhancer';
import loggerMiddleware from './middleware/loggerMiddleware';
import { persistStore } from 'redux-persist';

const persistedReducer = rootReducer;

const store = configureStore({
  reducer: persistedReducer,
  enhancers: [monitorReducerEnhancer as StoreEnhancer],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(loggerMiddleware),
});

const persistor = persistStore(store);

export { store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
