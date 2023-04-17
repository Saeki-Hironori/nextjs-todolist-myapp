import { Timestamp } from "firebase/firestore";

export type TODO = {
  id: string;
  createdAt: Timestamp;
  status: string;
  title: string;
  detail: string;
};

export type TODOArray = Array<{
  id: string;
  createdAt: Timestamp;
  status: string;
  title: string;
  detail: string;
}>;
