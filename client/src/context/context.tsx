import React, { createContext, useReducer, ReactElement } from "react";
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

  const setMe = (me: IMe) => {
    dispatch({ type: "SET_ME", payload: me });
  };

  const value: MainContext = { setMe, ...state };
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

export { MyContextProvider, MyContext };
