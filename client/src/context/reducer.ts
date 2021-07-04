export function reducer(state: IState, action: Action): IState {
  if (action.type === "SET_ME") {
    return { ...state, me: action.payload };
  } else if (action.type === "SET_MY_POSTS") {
    return { ...state, me: { ...state.me, posts: action.payload } };
  } else if (action.type === "REMOVE_MY_POST") {
    return {
      ...state,
      me: {
        ...state.me,
        posts: state.me.posts?.filter(post => post.id !== action.payload),
      },
    };
  } else if (action.type === "ADD_MY_POST") {
    state.me.posts?.push(action.payload);
    return { ...state };
  }

  throw new Error("reducer couldn't find it");
}
