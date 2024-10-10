import { ButtonEntity } from './types.ts';
import { EventBus } from '../events';
import Konva from 'konva';

export class Button {
    private _eventBus: EventBus;
    private readonly _buttonGroup: Konva.Group;
    id: string;

    constructor(buttonEntity: ButtonEntity, eventBus: EventBus) {
        this._eventBus = eventBus;
        this.id = buttonEntity.id;

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
                targetId: this.id,
                evt: evt.evt,
                button: this,
            });
        })
    }

    get instance() {
        return this._buttonGroup;
    }
}