export class EventBus {
    private _eventObject: Record<string, Array<(data: any) => void>> = {}

    fire(eventName: string, data: any) {
        const handlerList = this._eventObject[eventName];
        console.log(eventName, handlerList, this._eventObject);

        for (const handler of handlerList) {
            handler(data);
        }
    }

    subscribe(eventName: string, handler: (eventData: any) => void) {
        if (!this._eventObject[eventName]) {
            this._eventObject[eventName] = [];
        }
        console.log(this._eventObject)

        this._eventObject[eventName].push(handler);
    }
}