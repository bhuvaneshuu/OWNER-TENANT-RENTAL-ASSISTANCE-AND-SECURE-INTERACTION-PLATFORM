import { createContext } from "react";

const AuthContext = createContext({
  authToken: "", // Bearer token string
  user: null,
  setAuthToken: () => {},
});

export default AuthContext;
