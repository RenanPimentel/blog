import React, {
  createContext,
  ReactElement,
  useCallback,
  useReducer,
  useState,
} from "react";
import io from "socket.io-client";
import { api } from "../util/api";
import { reducer } from "./reducer";

const defaultAvatar: string =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Fdefault-profile-icon%2Fdefault-profile-icon-16.jpg&f=1&nofb=1";
const defaultBanner: string =
  "https://images.unsplash.com/photo-1622988869811-a4f3d3fe5441?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80";

const MainContext = createContext({} as MainContext);

const defaultState: IState = {
  me: { posts: [] },
};

interface Props {
  children: ReactElement;
}

function MyContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [isDark, setIsDark] = useState(localStorage.getItem("dark") === "true");
  const [title, setTitle] = useState("Three Dots");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const socket = state.me.id ? io("ws://localhost:4000") : null;

  const getMe = useCallback(async () => {
    try {
      const response = await api.get("/me");
      dispatch({ type: "SET_ME", payload: response.data.data.user });
    } catch (err) {}
  }, []);

  const setMe: MainContext["setMe"] = me => {
    dispatch({ type: "SET_ME", payload: me });
  };

  const setMyPosts: MainContext["setMyPosts"] = async posts => {
    dispatch({ type: "SET_MY_POSTS", payload: posts });
  };

  const removeMyPost: MainContext["removeMyPost"] = id => {
    dispatch({ type: "REMOVE_MY_POST", payload: id });
  };

  const updateMyPost: MainContext["updateMyPost"] = (id, post) => {
    const newPosts = state.me.posts?.map(p =>
      p.id === id ? { ...post, id } : p
    );
    dispatch({ type: "SET_MY_POSTS", payload: newPosts });
  };

  const addMyPost: MainContext["addMyPost"] = post => {
    dispatch({ type: "ADD_MY_POST", payload: post });
  };

  const value: MainContext = {
    defaultAvatar,
    defaultBanner,
    isDark,
    socket,
    notifications,
    title,
    setTitle,
    setIsDark,
    setNotifications,
    getMe,
    setMyPosts,
    setMe,
    removeMyPost,
    addMyPost,
    updateMyPost,
    ...state,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}

export { MyContextProvider, MainContext };
