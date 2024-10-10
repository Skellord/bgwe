import { GameParamsProvider } from './GameParamsProvider.ts';

export type ParamName = string;
export type ParamValue = string | number | boolean;

export type GameParameters = Record<ParamName, ParamValue>;

export interface GameActionObject {
    name: string;
    paramsProvider: GameParamsProvider;
}

export type GameActionListener = (evt: GameActionObject) => void;

export interface Action {
    name: string;
    on: string,
    targetId: string;
    handler: (evt: GameActionObject) => void;
}

export interface Rules {
    params?: GameParameters;
    actions?: Action[];
}

const action: Action = {
    on: 'click',
    targetId: 'button',
    handler: evt => {
        evt.paramsProvider.changeParameter('first', '2');
    }
}