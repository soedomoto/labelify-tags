import { HTMLAttributes } from "react";
import { BaseStoreState } from "../Base/types";

export type ViewProps = HTMLAttributes<HTMLDivElement> & {
  style?: string;
}

export type ViewState = BaseStoreState & ViewProps