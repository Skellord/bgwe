import Konva from 'konva';

import { AbstractEntity, ButtonEntity } from './types.ts';
import { EventBus } from '../events/index.ts';

export class Button extends AbstractEntity {
    private _eventBus: EventBus;
    private readonly _buttonGroup: Konva.Group;
    private _id: string;

    constructor(buttonEntity: ButtonEntity, eventBus: EventBus) {
        super();
        this._eventBus = eventBus;
        this._id = buttonEntity.id;

        this._buttonGroup = new Konva.Group({
            x: buttonEntity.x,
            y: buttonEntity.y,
            width: buttonEntity.w,
            height: buttonEntity.h,
        });

        if (buttonEntity.fill) {
            const rect = new Konva.Rect({
                x: 0,
                y: 0,
                width: buttonEntity.w,
                height: buttonEntity.h,
                fill: buttonEntity.fill,
            });

            this._buttonGroup.add(rect);
        }

        const text = new Konva.Text({
            x: 0,
            y: 0,
            width: buttonEntity.w,
            height: buttonEntity.h,
            fontSize: 20,
            align: 'center',
            verticalAlign: 'middle',
            text: buttonEntity.text,
            cursor: 'pointer',
        });

        this._buttonGroup.add(text);

        this._buttonGroup.on('click', evt => {
            this._eventBus.fire('buttonclick', {
                targetId: this._id,
                evt: evt.evt,
                button: this,
            });
        });
    }

    get instance() {
        return this._buttonGroup;
    }
    get id() {
        return this._id;
    }
}
