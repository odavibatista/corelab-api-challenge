declare namespace Express {
  export interface Request {
    userIp: string | string[];
    user?: {
      id: string;
      name: string;
    };
  }
}
