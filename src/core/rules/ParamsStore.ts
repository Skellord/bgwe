import { GameParameters, ParamName, ParamValue } from './types.ts';
import { EventBus } from '../events';

export class ParamsStore {
    private _parameters: GameParameters | null = null;
    private _eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this._eventBus = eventBus;
    }

    addParameter(parameter: GameParameters): void {
        this._parameters = {...this._parameters, ...parameter };
    }

    removeParameter(parameterName: ParamName): void {
        if (!this._parameters) {
            return;
        }

        delete this._parameters[parameterName];
    }

    getParameter(paramName: ParamName) {
        return this._parameters?.[paramName];
    }

    changeParameter(paramName: ParamName, paramValue: ParamValue): void {
        console.log('changeParameter', paramName, paramValue, this._parameters);
        if (!this._parameters) {
            return;
        }

        this._parameters[paramName] = paramValue;
        this._eventBus.fire(`change_${paramName}`, { value: paramValue });
    }
}