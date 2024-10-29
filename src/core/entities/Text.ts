import Konva from 'konva';

import { AbstractEntity, TextEntity } from '../types';
import { EventBus } from '../events';

export class Text extends AbstractEntity {
    private _textShape: Konva.Text;
    private _eventBus: EventBus;
    private _id: string;

    constructor(textEntity: TextEntity, eventBus: EventBus) {
        super();
        this._eventBus = eventBus;
        this._id = textEntity.id;

        this._textShape = new Konva.Text({
            x: textEntity.x,
            y: textEntity.y,
            width: textEntity.w,
            height: textEntity.h,
            name: textEntity.type,
            text: textEntity.value,
            fontSize: 18,
        });

        if (textEntity.listeningParam) {
            this.subscribeParamChanging(textEntity.listeningParam);
        }
    }

    get instance() {
        return this._textShape;
    }

    get id() {
        return this._id;
    }

    setValue(value: string) {
        this._textShape.text(value);
    }

    subscribeParamChanging(paramName: string) {
        this._eventBus.subscribe(`change_${paramName}`, eventData => {
            const text = eventData.value;
            this._textShape.text(text);
        });
    }
}
