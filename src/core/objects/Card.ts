import Konva from 'konva';

import { BasicEntity, CardEntity } from './types.ts';
import { BasicShape } from './BasicShape.ts';

export class Card extends Konva.Group {
    private readonly _frontEntities: BasicEntity[];
    private readonly _backEntities: BasicEntity[];
    private readonly _frontSideGroup: Konva.Group;
    private readonly _backSideGroup: Konva.Group;
    private _isFlipped: boolean;
    private _indexInDeck: number | null = null;
    private _parameters: CardEntity;

    constructor(cardEntity: CardEntity) {
        super({
            x: cardEntity.x,
            y: cardEntity.y,
            width: cardEntity.w,
            height: cardEntity.h,
            draggable: true,
            id: cardEntity.id,
            rotation: cardEntity.rotation,
            //card_default
            name: `${cardEntity.type}_${cardEntity.name}`,
            offset: {
                x: Math.round(cardEntity.w / 2),
                y: Math.round(cardEntity.h / 2),
            },
        });

        this._parameters = cardEntity;
        this.on('contextmenu', eventData => {
            eventData.evt.preventDefault();
            this.getStage()?.fire('cardcontextmenu', { target: this });
        });

        if (cardEntity.indexInDeck) {
            this._indexInDeck = cardEntity.indexInDeck;
        }

        this._isFlipped = cardEntity.isFlipped;
        this._frontEntities = cardEntity.front;
        this._backEntities = cardEntity.back;

        this._frontSideGroup = new Konva.Group({
            visible: !this._isFlipped,
        });
        this._backSideGroup = new Konva.Group({
            visible: this._isFlipped,
        });

        this.renderBasicEntities(this._frontEntities, this._frontSideGroup);
        this.renderBasicEntities(this._backEntities, this._backSideGroup);

        const box = new Konva.Rect({
            x: 0,
            y: 0,
            width: cardEntity.w,
            height: cardEntity.h,
            fill: cardEntity.fill,
            stroke: cardEntity.stroke,
            strokeWidth: cardEntity.strokeWidth,
            cornerRadius: cardEntity.cornerRadius,
        });

        this.add(box);
        this.add(this._frontSideGroup, this._backSideGroup);

        this.updateVisibleSide();
    }

    private updateVisibleSide() {
        this._frontSideGroup.setAttr('visible', !this._isFlipped);
        this._backSideGroup.setAttr('visible', this._isFlipped);
    }

    public flip() {
        this._isFlipped = !this._isFlipped;
        this.updateVisibleSide();
    }

    private renderBasicEntities(basicEntities: BasicEntity[], container: Konva.Group) {
        basicEntities.forEach(entity => {
            BasicShape.renderEntity(entity, container);
        });
    }

    get isFlipped() {
        return this._isFlipped;
    }

    set isFlipped(isFlipped) {
        this._isFlipped = isFlipped;
        this.updateVisibleSide();
    }

    get front() {
        return this._frontEntities;
    }

    get back() {
        return this._backEntities;
    }

    get indexInDeck() {
        return this._indexInDeck;
    }

    set indexInDeck(index: number | null) {
        this._indexInDeck = index;
    }

    get parameters() {
        return this._parameters;
    }
}
