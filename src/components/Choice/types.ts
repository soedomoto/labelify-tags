import { HTMLAttributes } from "react";
import { BaseStoreState } from "../Base/types";

export type ChoiceProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  parentId?: string;
  style?: string;
  value?: string;
}

export type ChoiceState = BaseStoreState & ChoiceProps