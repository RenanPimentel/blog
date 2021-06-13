/* eslint-disable no-restricted-globals */
import React, { createContext, useReducer, ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../util/api";
import { reducer } from "./reducer";

const MyContext = createContext({} as MainContext);

const defaultState = {
  me: {},
} as IState;

interface Props {
  children: ReactElement;
}

function MyContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const logout = async () => {
    await api.get("/logout");
    location.assign("/me");
  };

  const setMe = (me: IMe) => {
    dispatch({ type: "SET_ME", payload: me });
  };

  const defaultAvatar: string =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Fdefault-profile-icon%2Fdefault-profile-icon-16.jpg&f=1&nofb=1";

  const value: MainContext = {
    defaultAvatar,
    logout,
    setMe,
    ...state,
  };
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

export { MyContextProvider, MyContext };
