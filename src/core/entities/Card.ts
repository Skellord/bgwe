import Konva from 'konva';

import { Deck } from './Deck.ts';
import { EventBus, EventTypes } from '../events';
import { BasicEntity, CardEntity } from './types.ts';
import { BasicEntityShape } from './BasicEntityShape.ts';

export class Card {
    private readonly _cardGroup: Konva.Group;
    private _isFlipped: boolean;
    private readonly _frontEntities: BasicEntity[];
    private readonly _backEntities: BasicEntity[];
    private readonly _frontSideGroup: Konva.Group;
    private readonly _backSideGroup: Konva.Group;
    private readonly _name: string;
    private _deck: Deck | null = null;
    private readonly _id: string;
    private _eventBus: EventBus;
    private _indexInDeck: number | null = null;
    private _parameters: CardEntity;

    constructor(cardEntity: CardEntity, eventBus: EventBus) {
        this._eventBus = eventBus;
        this._parameters = cardEntity;

        this._cardGroup = new Konva.Group({
            x: cardEntity.x,
            y: cardEntity.y,
            width: cardEntity.w,
            height: cardEntity.h,
            draggable: true,
            name: `${cardEntity.type}_${cardEntity.name}`,
            offset: {
                x: Math.round(cardEntity.w / 2),
                y: Math.round(cardEntity.h / 2),
            },
        });

        if (cardEntity.indexInDeck) {
            this._indexInDeck = cardEntity.indexInDeck;
        }

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
            fill: cardEntity.fill,
            stroke: cardEntity.stroke,
            strokeWidth: cardEntity.strokeWidth,
            cornerRadius: cardEntity.cornerRadius,
        });

        this._cardGroup.add(card);
        this._cardGroup.add(this._frontSideGroup, this._backSideGroup);

        this.updateVisibleSide();
        this.subscribeToEvents();
    }

    private updateVisibleSide() {
        this._frontSideGroup.setAttr('visible', !this._isFlipped);
        this._backSideGroup.setAttr('visible', this._isFlipped);
    }

    public flip() {
        if (this._deck) {
            this._deck.flip();
        } else {
            this._isFlipped = !this._isFlipped;
            this.updateVisibleSide();
        }
    }

    public rotate(deg: number) {
        this._cardGroup.rotate(deg);
    }

    private subscribeToEvents() {
        this._cardGroup.on('dragstart', evt => {
            this._eventBus.fire(EventTypes.CardDragStart, {
                card: this,
                evt: evt.evt,
            });
        });

        this._cardGroup.on('dragend', evt => {
            this._eventBus.fire(EventTypes.CardDragEnd, {
                card: this,
                evt: evt.evt,
            });
        });

        this._cardGroup.on('dblclick', () => {
            this.flip();
        });

        this._cardGroup.on('click', evt => {
            this._eventBus.fire('cardclick', {
                card: this,
                evt: evt.evt,
                targetId: '1',
            });
        });

        this._cardGroup.on('contextmenu', evt => {
            evt.evt.preventDefault();
            this._eventBus.fire(EventTypes.CardMenuOpen, {
                card: this,
                evt: evt.evt,
            });
        });
    }

    private renderBasicEntities(basicEntities: BasicEntity[], container: Konva.Group) {
        basicEntities.forEach(entity => {
            BasicEntityShape.renderEntity(entity, container);
        });
    }

    get instance() {
        return this._cardGroup;
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
