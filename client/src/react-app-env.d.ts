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
  me: IMe;
  logout(): void;
  setMe(me: IMe): void;
}
