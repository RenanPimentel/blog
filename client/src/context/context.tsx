import React, { createContext, useReducer, ReactElement } from "react";
import { reducer } from "./reducer";

const MyContext = createContext({});

const defaultState = {};

interface Props {
  children: ReactElement;
}

function MyContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return <MyContext.Provider value={state}>{children}</MyContext.Provider>;
}

export default MyContextProvider;
