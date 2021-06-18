/// <reference types="react-scripts" />
interface IMe {
  id?: string;
  password?: string;
  username?: string;
  email?: string;
  avatar?: string;
  banner?: string;
  last_login?: string;
  posts: IPost[];
}

interface IPost {
  id?: string;
  title?: string;
  content?: string;
  read_time?: number;
  topic?: string;
  updated_at?: string;
  created_at?: string;
  author_id?: string;
}

interface IUser {
  id?: string;
  password?: string;
  username?: string;
  email?: string;
  avatar?: string;
  banner?: string;
  last_login?: string;
}

interface IState {
  comments: IComment[];
  me: IMe;
}

interface IComment {
  id: string;
  author_id: string;
  craeted_at: string;
  updated_at: string;
  content: string;
  post_id: string;
}

interface Action {
  type: string;
  payload: any;
}

interface MainContext {
  defaultAvatar: string;
  defaultBanner: string;
  me: IMe;
  comments: IComment[];
  logout(): void;
  getMe(): void;
  setMe(me: IMe): void;
  removeMyPost(id?: string): void;
  setMyPosts(id?: string): void;
  updateMyPost(id?: string, post: { title; content; topic }): void;
  addMyPost(post: IPost): void;
  addComment(comment: IComment): void;
  setComments(comments: IComment[]): void;
}

type FieldError = { field: string; reason: string };
