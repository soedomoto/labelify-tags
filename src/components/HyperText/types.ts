import { HTMLAttributes } from "react";
import { BaseStoreState } from "../Base/types";

export type HyperTextProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  name?: string;
  style?: string;
}

export type HyperTextState = BaseStoreState & HyperTextProps