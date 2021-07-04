interface ENV {
  PGUSER: string;
  PGHOST: string;
  PGPASSWORD: string;
  PGDATABASE: string;
  PGPORT: string;
  NODE_ENV: string;
  PORT: string;
  CLIENT_URL: "http://localhost:3000";
  GMAILPASS: string;
  GMAILUSER: string;
}

interface FieldError {
  field?: string;
  reason: string;
}

interface MyResponse {
  errors: FieldError[] | null;
  data: Object | null;
}

interface LoginBody {
  login?: string;
  password?: string;
}

interface RegisterBody {
  username?: string;
  email?: string;
  password?: string;
}

interface PostsBody {
  post?: Post;
}

interface Post {
  id: string;
  content: string;
  title: string;
  topic: string;
  read_time: number;
  author_id: number;
}

interface StrObj {
  [key: string]: string;
}
