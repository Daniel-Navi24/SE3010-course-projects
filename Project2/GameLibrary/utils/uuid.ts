// IMPORTANT: this polyfill must be imported before `uuid`
// so that uuid can use crypto.getRandomValues on native.
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export function newId(): string {
  return uuidv4();
}
