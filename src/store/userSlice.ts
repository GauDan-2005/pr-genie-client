import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, action) => action.payload, // setting the user state
    // ...existing or future reducers...
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
