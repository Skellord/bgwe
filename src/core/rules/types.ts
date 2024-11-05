import { ParamsStore } from './ParamsStore.ts';

export type ParamName = string;
export type ParamValue = string | number | boolean;

export type GameParameters = Record<ParamName, ParamValue>;

export interface GameActionObject {
    paramsStore: ParamsStore;
}

export type GameActionListener = (evt: GameActionObject) => void;

export interface Action {
    name: string;
    on: string;
    targetId: string;
    handler: GameActionListener;
}

export interface Rules {
    params?: GameParameters;
    actions?: Action[];
}
