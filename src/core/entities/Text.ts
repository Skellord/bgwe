import Konva from 'konva';
import { TextEntity } from '../types';
import { EventBus } from '../events/EventBus.ts';

export class Text {
    private _textShape: Konva.Text;
    private _eventBus: EventBus;

    constructor(textEntity: TextEntity, eventBus: EventBus) {
        this._eventBus = eventBus;
        this._textShape = new Konva.Text({
            x: textEntity.x,
            y: textEntity.y,
            width: textEntity.w,
            height: textEntity.h,
            name: textEntity.type,
            id: textEntity.id,
            text: textEntity.value,
            fontSize: 18,
        });
    }

    get instance() {
        return this._textShape;
    }

    setValue(value: string) {
        this._textShape.text(value);
    }

    subscribeParamChanging(paramName: string) {
        this._eventBus.subscribe(`change_${paramName}`, eventData => {
            const text = eventData.value;
            console.log(eventData)
            this._textShape.text(text);
        })
    }
}