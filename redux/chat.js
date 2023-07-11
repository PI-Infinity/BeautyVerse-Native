import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null,
  openAddChat: false,
  rerenderRooms: false,
  rerenderMessages: false,
  rerenderScroll: false,
  chatUser: null,
  rooms: [],
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
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    updateRoom: (state, action) => {
      const { roomId, lastMessageCreatedAt, lastSender, lastMessage, status } =
        action.payload;
      const roomIndex = state.rooms.findIndex((room) => room.room === roomId);
      if (roomIndex > -1) {
        state.rooms[roomIndex] = {
          ...state.rooms[roomIndex],
          lastMessageCreatedAt: lastMessageCreatedAt,
          lastSender: lastSender,
          lastMessage: lastMessage,
          status: status,
        };
      }
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
  setRooms,
  updateRoom,
} = Chat.actions;
export default Chat.reducer;
