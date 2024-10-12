export class EventBus {
    private _eventObject: Record<string, Array<(data: any) => void>> = {};

    fire(eventName: string, data: any) {
        const handlerList = this._eventObject[eventName];

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

    unsubscribeAll() {
        this._eventObject = {};
    }
}
