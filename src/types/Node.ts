import {Position} from "./Position";
import {Port} from "./Port";

export interface Node {
  id: string;
  position: Position;
  inputPorts: Port[];
  outputPorts: Port[];
}
