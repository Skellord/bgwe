import Konva from 'konva';

import { Deck } from './Deck.ts';
import { EventBus, EventTypes } from '../events';
import { BasicEntity, CardEntity } from './types.ts';

export class Card {
    private readonly cardGroup: Konva.Group;
    private _isFlipped: boolean;
    private readonly _frontEntities: BasicEntity[];
    private readonly _backEntities: BasicEntity[];
    private readonly _frontSideGroup: Konva.Group;
    private readonly _backSideGroup: Konva.Group;
    private readonly _name: string;
    private _deck: Deck | null = null;
    private readonly _id: string;
    private _eventBus: EventBus;

    constructor(cardEntity: CardEntity, eventBus: EventBus) {
        this._eventBus = eventBus;

        this.cardGroup = new Konva.Group({
            x: cardEntity.x,
            y: cardEntity.y,
            width: cardEntity.w,
            height: cardEntity.h,
            draggable: true,
            name: `${cardEntity.type}_${cardEntity.name}`,
        });

        this._name = cardEntity.name;
        this._id = cardEntity.id;
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

        const card = new Konva.Rect({
            x: 0,
            y: 0,
            width: cardEntity.w,
            height: cardEntity.h,
            fill: 'red',
        });

        this.cardGroup.add(card);
        this.cardGroup.add(this._frontSideGroup, this._backSideGroup);

        this.updateVisibleSide();
        this.subscribeToEvents();
    }

    private updateVisibleSide() {
        this._frontSideGroup.setAttr('visible', !this._isFlipped);
        this._backSideGroup.setAttr('visible', this._isFlipped);
    }

    private flip() {
        this._isFlipped = !this._isFlipped;
        this.updateVisibleSide();
    }

    private subscribeToEvents() {
        this.cardGroup.on('dragstart', evt => {
            this._eventBus.fire(EventTypes.CardDragStart, {
                card: this,
                evt: evt.evt,
            });
        });

        this.cardGroup.on('dragend', evt => {
            this._eventBus.fire(EventTypes.CardDragEnd, {
                card: this,
                evt: evt.evt,
            });
        });

        this.cardGroup.on('dblclick', () => {
            this.flip();
        });

        this.cardGroup.on('click', evt => {
            this._eventBus.fire('cardclick', {
                card: this,
                evt: evt.evt,
                targetId: '1',
            });
        });
    }

    private renderBasicEntities(basicEntities: BasicEntity[], container: Konva.Group) {
        basicEntities.forEach(entity => {
            if (entity.type === 'image') {
                const imageObj = new Image();

                imageObj.onload = function () {
                    const image = new Konva.Image({
                        x: entity.x,
                        y: entity.y,
                        image: imageObj,
                        width: entity.w,
                        height: entity.h,
                    });

                    container.add(image);
                };

                imageObj.src = entity.src;
            }
        });
    }

    get instance() {
        return this.cardGroup;
    }

    get name() {
        return this._name;
    }

    get deck() {
        return this._deck;
    }

    set deck(deck: Deck | null) {
        this._deck = deck;
    }

    get id() {
        return this._id;
    }

    get isFlipped() {
        return this._isFlipped;
    }

    get front() {
        return this._frontEntities;
    }

    get back() {
        return this._backEntities;
    }
}
