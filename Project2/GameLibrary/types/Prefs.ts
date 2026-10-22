import { GameStatus } from "./Game";

export type DefaultFilter = GameStatus | "all";

export type Prefs = {
  defaultFilter: DefaultFilter;
  hapticsEnabled: boolean;
};
