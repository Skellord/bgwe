import { Action } from './types.ts';

export class ActionsStore {
    private _actions: Action[] = [];

    addActions(actions: Action[]) {
        for (const action of actions) {
            this._actions.push(action);
        }
    }

    get actions() {
        return this._actions;
    }
}