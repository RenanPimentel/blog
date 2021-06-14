/// <reference types="react-scripts" />
interface IMe {
  id?: string;
  password?: string;
  username?: string;
  email?: string;
  avatar?: string;
  banner?: string;
  last_login?: string;
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
}

type FieldError = { field: string; reason: string };
