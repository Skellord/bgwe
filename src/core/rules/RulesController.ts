import { GameEngine } from '../GameEngine.ts';
import { ParamsStore } from './ParamsStore.ts';
import { Action, GameParameters } from './types.ts';
import { ActionsStore } from './ActionsStore.ts';
import { EventBus } from '../events';

export class RulesController {
    private readonly _paramsStore: ParamsStore;
    private _actionsStore: ActionsStore = new ActionsStore();
    private _eventBus: EventBus;

    constructor(gameEngine: GameEngine) {
        this._eventBus = gameEngine.eventBus;
        this._paramsStore = new ParamsStore(gameEngine.eventBus);
    }

    registerParameters(params: GameParameters) {
        for (const parameter in params) {
            this._paramsStore.addParameter({
                [parameter]: params[parameter],
            });
        }
    }

    registerActions(actions: Action[]) {
        this._actionsStore.addActions(actions);
    }

    activateActions() {
        this._actionsStore.actions.forEach(a => {
            this._eventBus.subscribe(a.on, eventData => {
                a.handler({ ...eventData, paramsStore: this.paramsStore });
            });
        });
    }

    get paramsStore() {
        return this._paramsStore;
    }
}
