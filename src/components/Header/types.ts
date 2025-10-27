import { HTMLAttributes } from "react";
import { BaseStoreState } from "../Base/types";

export type HeaderProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  size?: number;
  style?: string;
}

export type HeaderState = BaseStoreState & HeaderProps