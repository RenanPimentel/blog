interface Action {
  type: string;
  payload: any;
}

export function reducer(state: IState, action: Action): IState {
  if (action.type === "SET_ME") {
    return { ...state, me: action.payload };
  } else if (action.type === "SET_MY_POSTS") {
    return { ...state, me: { ...state.me, myPosts: action.payload } };
  }

  throw new Error("reducer couldn't find it");
}
