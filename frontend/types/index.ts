export interface UserData {
  firstName: string;
  lastName: string;
  bio: string;
  social: {
    instagram: string;
    facebook: string;
  };
  courses: Array<{
    code: string;
    title: string;
  }>;
  email: string;
  username: string;
  id?: number;
  friendships: {
    count: number;
  };
}