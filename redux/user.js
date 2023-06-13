import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  targetUser: null,
};

export const User = createSlice({
  name: "User",
  initialState,

  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    UpdateCurrentUserProcedure: (state, action) => {
      const { procedureId, updatedProcedure } = action.payload;
      const procedureIndex = state.currentUser.procedures.findIndex(
        (procedure) => procedure._id === procedureId
      );

      if (procedureIndex !== -1) {
        state.currentUser.procedures[procedureIndex] = updatedProcedure;
      }
    },
    AddCurrentUserProcedure: (state, action) => {
      const newProcedure = action.payload;

      if (state.currentUser.procedures) {
        state.currentUser.procedures.push(newProcedure);
      } else {
        state.currentUser.procedures = [newProcedure];
      }
    },
    RemoveCurrentUserProcedure: (state, action) => {
      const procedureId = action.payload;

      if (state.currentUser.procedures) {
        state.currentUser.procedures = state.currentUser.procedures.filter(
          (procedure) => procedure._id !== procedureId
        );
      }
    },
  },
});

export const {
  setCurrentUser,
  AddCurrentUserProcedure,
  UpdateCurrentUserProcedure,
  RemoveCurrentUserProcedure,
} = User.actions;
export default User.reducer;
