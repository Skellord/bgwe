import { InternalEventData, InternalEvents } from './types';

const INTERNAL_EVENTS: InternalEvents[] = [InternalEvents.Move, InternalEvents.RemoveParent];

const emptyInternalEventObject: Record<InternalEvents, Array<(data: any) => void>> = {
    _move: [],
    _remove_parent: [],
    _flip: [],
};

export class EventBus {
    private _eventObject: Record<string, Array<(data: any) => void>> = {};
    private _internalEventObject: Record<InternalEvents, Array<(data: any) => void>> = emptyInternalEventObject;

    fire(eventName: string, data: any) {
        const handlerList = this._eventObject[eventName];

        if (handlerList?.length > 0) {
            for (const handler of handlerList) {
                handler(data);
            }
        }
    }

    fireInternal(eventName: InternalEvents, data: InternalEventData) {
        const handlerList = this._internalEventObject[eventName];

        if (handlerList?.length > 0) {
            for (const handler of handlerList) {
                handler(data);
            }
        }
    }

    subscribe(eventName: string, handler: (eventData: any) => void) {
        if (!this._eventObject[eventName]) {
            this._eventObject[eventName] = [];
        }

        this._eventObject[eventName].push(handler);
    }

    subscribeInternal(eventName: InternalEvents, handler: (eventData: InternalEventData) => void) {
        if (!this._internalEventObject[eventName]) {
            this._internalEventObject[eventName] = [];
        }

        this._internalEventObject[eventName].push(handler);
    }

    subscribeInternals(handler: (eventData: InternalEventData) => void) {
        for (const event of INTERNAL_EVENTS) {
            this._internalEventObject[event].push(handler);
        }
    }

    unsubscribeAll() {
        this._eventObject = {};
        this._internalEventObject = emptyInternalEventObject;
    }
}
