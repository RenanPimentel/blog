/// <reference types="react-scripts" />

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

interface IMe extends IUser {
  password?: string;
  posts?: IPost[];
}

interface IUser {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  banner?: string;
  last_login?: string;
  online?: boolean;
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
  likes: boolean;
  like_count: string;
  username: string;
  avatar: string;
}

interface IBlock {
  value: string;
  editing: boolean;
  showOptions: boolean;
  optionValue: OptionValue;
}

type OptionValue = "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "block";

interface Action {
  type: string;
  payload: any;
}

interface INotification {
  id: string;
  sender_id: string;
  at_id: string;
  type: "comment" | "post";
  created_at: string;
  content: string;
}

interface MainContext {
  defaultAvatar: string;
  defaultBanner: string;
  isDark: boolean;
  me: IMe;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  notifications: INotification[];
  setNotifications: CallableFunction;
  title: string;
  setTitle: CallableFunction;
  setIsDark(isDark: boolean): void;
  getMe(): void;
  setMe(me: IMe): void;
  removeMyPost(id?: string): void;
  setMyPosts(posts: IPost[]): void;
  updateMyPost(id?: string, post: IPost): void;
  addMyPost(post: IPost): void;
}

type FieldError = { field: string; reason: string };

type CommentsResponse = { data: { comments: IComment[] } };
type UserResponse = { data: { user: IUser } };
type PostResponse = { data: { post: IPost } };
type PostsResponse = { data: { posts: IPost[] } };
type CountResponse = { data: { count: string } };
type LikesResponse = { data: { likes: boolean } };
type FollowerCountResponse = { data: { follows: boolean; count: string } };
type UsersResponse = { data: { users: IUser[] } };
type NotificationResponse = { data: { notification: INotification } };
type SearchResponse = {
  data: { posts: (IPost & { username: string })[]; users: IUser[] };
};
