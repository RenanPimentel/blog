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
  username?: string;
  email?: string;
  avatar?: string;
  banner?: string;
  last_login?: string;
}

interface IState {
  me: IMe;
}

interface IComment {
  id: string;
  author_id: string;
  post_author_id: string;
  created_at: string;
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
  isDark: boolean;
  setIsDark(isDark: boolean): void;
  getMe(): void;
  setMe(me: IMe): void;
  removeMyPost(id?: string): void;
  setMyPosts(id?: string): void;
  updateMyPost(id?: string, post: { title; content; topic }): void;
  addMyPost(post: IPost): void;
}

type FieldError = { field: string; reason: string };

type CommentsResponse = { data: { comments: IComment[] } };
type UserResponse = { data: { user: IUser } };
type PostResponse = { data: { post: IPost } };
type CountResponse = { data: { count: string } };
type LikesResponse = { data: { likes: boolean } };
type FollowerCountResponse = { data: { follows: boolean; count: string } };
