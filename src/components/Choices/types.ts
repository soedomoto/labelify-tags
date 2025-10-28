import { HTMLAttributes } from "react";
import { BaseStoreState } from "../Base/types";

export type ChoicesProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  parentId?: string;
  style?: string;
  name?: string;
  toName?: string;
  choice?: 'single' | 'multiple';
  showInLine?: 'true' | 'false';
}

export type ChoicesState = BaseStoreState & ChoicesProps & {
  value?: string[];
}