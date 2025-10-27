import { HTMLAttributes } from "react";
import { BaseStoreState } from "../Base/types";

export type TextProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  value?: string;
  name?: string;
  style?: string;
}

export type TextState = BaseStoreState & TextProps