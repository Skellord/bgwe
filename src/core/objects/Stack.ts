import Konva from 'konva';

import { StackEntity } from './types';
import { Card } from './Card';

export class Stack extends Konva.Group {
    private readonly _for: string;
    private _children: Array<Konva.Group | Konva.Shape> = [];
    readonly stroke?: string;

    constructor(stackEntity: StackEntity) {
        super({
            x: stackEntity.x,
            y: stackEntity.y,
            width: stackEntity.w,
            height: stackEntity.h,
            id: stackEntity.id,
        });

        this.stroke = stackEntity.stroke;
        this._for = stackEntity.for;

        const box = new Konva.Rect({
            x: 0,
            y: 0,
            width: stackEntity.w,
            height: stackEntity.h,
            stroke: stackEntity.stroke,
        });

        this.add(box);
    }

    addCard(card: Card) {
        this._children.push(card);
        this.updateChildrenPosition();
        this.add(card);
    }

    removeCard(object: Konva.Group | Konva.Shape) {
        this._children = this._children.filter(c => c.id() !== object.id());
        this.updateChildrenPosition();
    }

    private updateChildrenPosition() {
        this._children.forEach((c, index) => {
            const x = c.width() / 2 + c.width() * index;
            const y = c.height() / 2;
            c.setPosition({ x, y });
        });
    }

    get for() {
        return this._for;
    }
}
