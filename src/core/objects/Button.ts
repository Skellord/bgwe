import Konva from 'konva';

import { ButtonEntity } from './types.ts';

export class Button extends Konva.Group {
    constructor(buttonEntity: ButtonEntity) {
        super({
            x: buttonEntity.x,
            y: buttonEntity.y,
            width: buttonEntity.w,
            height: buttonEntity.h,
            id: buttonEntity.id,
            rotation: buttonEntity.rotation,
        });

        const box = new Konva.Rect({
            x: 0,
            y: 0,
            width: buttonEntity.w,
            height: buttonEntity.h,
            fill: buttonEntity.fill,
        });

        this.add(box);

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

        this.add(text);

        this.on('click', eventData => {
            this.getStage()?.fire('buttonclick', eventData);
        });
    }
}
