import {configureStore} from '@reduxjs/toolkit';
import ingredientStoreReducer from '../features/ingredientStore/ingredientStoreSlice';

export default configureStore({
  reducer: {
    ingredientStore: ingredientStoreReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});
