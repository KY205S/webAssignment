// Context.js
import React from "react";

const MyContext = React.createContext({
  isDoctor: false,
  setIsDoctor: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export default MyContext;
