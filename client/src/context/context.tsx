/* eslint-disable no-restricted-globals */
import React, { createContext, useReducer, ReactElement } from "react";
import { api } from "../util/api";
import { reducer } from "./reducer";

const MainContext = createContext({} as MainContext);

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

  const setMyPosts = async (id?: string) => {
    const response = await api.get(`/posts/${id}`);
    dispatch({ type: "SET_MY_POSTS", payload: response.data.posts });
  };

  const defaultAvatar: string =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Fdefault-profile-icon%2Fdefault-profile-icon-16.jpg&f=1&nofb=1";

  const defaultBanner: string =
    "https://images.unsplash.com/photo-1622988869811-a4f3d3fe5441?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80";

  const value: MainContext = {
    defaultAvatar,
    defaultBanner,
    logout,
    setMe,
    setMyPosts,
    ...state,
  };
  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}

export { MyContextProvider, MainContext };
