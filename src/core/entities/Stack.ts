import Konva from 'konva';

import { AbstractEntity, StackEntity } from './types';
import { Card } from './Card';

export class Stack extends AbstractEntity {
    private readonly _for: string;
    private readonly _id: string;
    private _stackGroup: Konva.Group;
    private _children: Card[] = [];
    private _parameters: StackEntity;

    constructor(stackEntity: StackEntity) {
        super();
        this._for = stackEntity.for;
        this._id = stackEntity.id;
        this._parameters = stackEntity;

        this._stackGroup = new Konva.Group({
            x: stackEntity.x,
            y: stackEntity.y,
            width: stackEntity.w,
            height: stackEntity.h,
        });

        const box = new Konva.Rect({
            x: 0,
            y: 0,
            width: stackEntity.w,
            height: stackEntity.h,
            stroke: stackEntity.stroke,
        });

        this._stackGroup.add(box);
    }

    addCard(card: Card) {
        card.instance.moveTo(this._stackGroup);
        this._children.push(card);
        card.parent = this;
        this.updateChildrenPosition();
    }

    removeCard(card: Card) {
        this._children = this._children.filter(c => c.id !== card.id);
        card.parent = null;
        this.updateChildrenPosition();
    }

    private updateChildrenPosition() {
        this._children.forEach((c, index) => {
            const x = c.instance.width() / 2 + c.instance.width() * index;
            const y = c.instance.height() / 2;
            c.instance.setPosition({ x, y });
        });
    }

    get instance() {
        return this._stackGroup;
    }

    get for() {
        return this._for;
    }

    get id() {
        return this._id;
    }

    get parameters() {
        return this._parameters;
    }
}
