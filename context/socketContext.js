import React, { createContext, useContext } from "react";

// Create context
export const SocketContext = createContext();

// A hook that allows you to use the socket in any functional component
export const useSocket = () => {
  return useContext(SocketContext);
};
