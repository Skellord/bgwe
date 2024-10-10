import { Action } from './types.ts';
import { GameParamsProvider } from './GameParamsProvider.ts';
import { EventBus } from '../events';
import { GameEngine } from '../GameEngine.ts';

export class ActionsProvider {
    private _actions: Action[] = [];
    private _paramsProvider: GameParamsProvider;
    private _eventBus: EventBus;

    constructor(gameEngine: GameEngine) {
        this._paramsProvider = gameEngine.paramsProvider;
        this._eventBus = gameEngine.eventBus;
    }

    registerActions(actions: Action[]) {
        for (const action of actions) {
            this._actions.push(action);
        }
    }

    registerAction(action: Action) {
        this._actions.push(action);
    }

    activateAction(action: Action) {
        this._eventBus.subscribe(action.on, eventData => {
            action.handler({ ...eventData, paramsProvider: this._paramsProvider})
        });
    }

    activateActions() {
        this._actions.forEach(a => {
            this._eventBus.subscribe(a.on, eventData => {
                a.handler({ ...eventData, paramsProvider: this._paramsProvider})
            });
        })
    }

    registerAndActivateActions(actions: Action[]) {
        for (const action of actions) {
            this.registerAction(action);
            this.activateAction(action);
        }
    }
}