import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null,
  openAddChat: false,
  rerenderRooms: false,
  rerenderMessages: false,
  rerenderScroll: false,
  chatUser: null,
};

export const Chat = createSlice({
  name: "Chat",
  initialState,

  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setOpenAddChat: (state, action) => {
      state.openAddChat = action.payload;
    },
    setRerederRooms: (state, action) => {
      state.rerenderRooms = !state.rerenderRooms;
    },
    setRerenderMessages: (state, action) => {
      state.rerenderMessages = !state.rerenderMessages;
    },
    setRerenderScroll: (state, action) => {
      state.rerenderScroll = !state.rerenderScroll;
    },
    setChatUser: (state, action) => {
      state.chatUser = action.payload;
    },
  },
});

export const {
  setCurrentChat,
  setOpenAddChat,
  setRerederRooms,
  setRerenderMessages,
  setRerenderScroll,
  setChatUser,
} = Chat.actions;
export default Chat.reducer;
