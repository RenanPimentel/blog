/// <reference types="react-scripts" />
interface IMe {
  id?: string;
  password?: string;
  username?: string;
  email?: string;
}

interface IState {
  me: IMe;
}

interface MainContext {
  me: IMe;
  setMe(me: IMe): void;
}
