import Konva from 'konva';

import { TextEntity } from '../types';
import { EventBus } from '../events';

export class Text extends Konva.Text {
    private _eventBus: EventBus;

    constructor(textEntity: TextEntity, eventBus: EventBus) {
        super({
            x: textEntity.x,
            y: textEntity.y,
            width: textEntity.w,
            height: textEntity.h,
            name: textEntity.type,
            text: textEntity.value,
            fontSize: 18,
        });

        this._eventBus = eventBus;

        if (textEntity.listeningParam) {
            this.subscribeParamChanging(textEntity.listeningParam);
        }
    }

    setValue(value: string) {
        this.text(value);
    }

    subscribeParamChanging(paramName: string) {
        this._eventBus.subscribe(`change_${paramName}`, eventData => {
            const text = eventData.value;
            this.text(text);
        });
    }
}
