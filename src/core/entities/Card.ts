import Konva from 'konva';
import { Deck } from './Deck.ts';
import { BasicEntity, CardEntity, EventTypes } from '../types';
import { EventBus } from '../events';

export class Card {
    private cardGroup: Konva.Group;
    private isFlipped: boolean;
    private frontEntities: BasicEntity[];
    private backEntities: BasicEntity[];
    private sideGroup: Konva.Group;
    private readonly _name: string;
    private _deck: Deck | null = null;
    private _id: string;
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
        this.isFlipped = cardEntity.isFlipped;
        this.frontEntities = cardEntity.front;
        this.backEntities = cardEntity.back;
        this.sideGroup = new Konva.Group();

        const card = new Konva.Rect({
            x: 0,
            y: 0,
            width: cardEntity.w,
            height: cardEntity.h,
            fill: 'red',
        });

        this.cardGroup.add(card);
        this.cardGroup.add(this.sideGroup);

        this.updateVisibleSide();
        this.subscribeToEvents();
    }

    private updateVisibleSide() {
        if (this.sideGroup.children.length > 0) {
            this.sideGroup.destroyChildren();
        }

        const visibleEntities = this.isFlipped ? this.backEntities : this.frontEntities;

        this.renderBasicEntities(visibleEntities, this.sideGroup);
        this.cardGroup.getLayer()?.draw();
    }

    private flip() {
        this.isFlipped = !this.isFlipped;
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

        this.cardGroup.on('click', (evt) => {
            this._eventBus.fire('cardclick', {
                card: this,
                evt: evt.evt,
                targetId: '1'
            });
        })
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
}
