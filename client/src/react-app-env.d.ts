/// <reference types="react-scripts" />
interface IMe {
  id?: string;
  password?: string;
  username?: string;
  email?: string;
  avatar?: string;
  banner?: string;
  last_login?: string;
  myPosts: IPost[];
}

interface IPost {
  id: string;
  title: string;
  content: string;
}

interface IState {
  me: IMe;
}

interface MainContext {
  defaultAvatar: string;
  defaultBanner: string;
  me: IMe;
  logout(): void;
  setMe(me: IMe): void;
  setMyPosts(id?: string): void;
}

type FieldError = { field: string; reason: string };
