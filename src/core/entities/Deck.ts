import Konva from 'konva';

import { AbstractEntity, DeckEntity } from './types.ts';
import { Card } from './Card.ts';
import { EventBus, EventTypes } from '../events';
import { Utils } from '../utils';

export class Deck extends AbstractEntity {
    private readonly _deckGroup: Konva.Group;
    private readonly _for: string;
    private _cards: Card[] = [];
    private _id: string;
    private _isFlipped: boolean;
    private _eventBus: EventBus;
    private _counter?: Konva.Text;
    private _parameters: DeckEntity;

    constructor(deckEntity: DeckEntity, eventBus: EventBus) {
        super();
        this._eventBus = eventBus;
        this._parameters = deckEntity;

        this._deckGroup = new Konva.Group({
            x: deckEntity.x,
            y: deckEntity.y,
            width: deckEntity.w,
            height: deckEntity.h,
            name: deckEntity.type,
            offset: {
                x: Math.round(deckEntity.w / 2),
                y: Math.round(deckEntity.h / 2),
            },
        });

        const box = new Konva.Rect({
            width: deckEntity.w,
            height: deckEntity.h,
            stroke: deckEntity.stroke,
            strokeWidth: deckEntity.strokeWidth,
            fill: deckEntity.fill,
        });

        if (deckEntity.withCount) {
            this._counter = new Konva.Text({
                x: 0,
                y: deckEntity.h + 12,
                width: deckEntity.w,
                height: 14,
                fontSize: 14,
                verticalAlign: 'middle',
                align: 'center',
                text: '0',
            });

            this._deckGroup.add(this._counter);
        }

        this._isFlipped = deckEntity.isFlipped;
        this._deckGroup.add(box);
        this._for = deckEntity.for;
        this._id = deckEntity.id;
        this.subscribeToEvents();
    }

    addCard(card: Card) {
        if (card.indexInDeck) {
            this._cards.splice(card.indexInDeck, 0, card);
        } else {
            this._cards.push(card);
            card.indexInDeck = this._cards.length - 1;
        }

        card.instance.moveTo(this._deckGroup);
        card.rotate(0);
        const absolutePosition = this._deckGroup.getAbsolutePosition();
        card.instance.setAbsolutePosition(absolutePosition);
        card.parent = this;
        card.isFlipped = this._isFlipped;
        this.updateVisibleCards();
        this.updateCounter();
    }

    flip() {
        this._isFlipped = !this._isFlipped;
        this._cards.reverse();
        this.updateCardIndexes();
        this.updateVisibleCards();
        this.updateFlippedCards();
    }

    removeCard(card: Card) {
        this._cards = this._cards.filter(c => c.id !== card.id);
        card.parent = null;
        card.indexInDeck = null;
        this.updateCardIndexes();
        this.updateVisibleCards();
        this.updateCounter();
    }

    rotate(deg: number) {
        this._deckGroup.rotate(deg);
    }

    shuffle() {
        Utils.shuffleArray(this._cards);
        this.updateCardIndexes();
        this.updateVisibleCards();
    }

    private updateCounter() {
        if (this._counter) {
            this._counter.text(this._cards.length.toString());
        }
    }

    private updateCardIndexes() {
        this._cards.forEach((c, index) => {
            c.indexInDeck = index;
        });
    }

    private subscribeToEvents() {
        this._deckGroup.on('contextmenu', evt => {
            evt.evt.preventDefault();
            this._eventBus.fire(EventTypes.DeckMenuOpen, {
                deck: this,
                evt: evt.evt,
            });
        });
    }

    private updateVisibleCards() {
        this._cards.forEach((card, index) => {
            card.instance.setAttrs({
                visible: index >= this._cards.length - 2,
                listening: index >= this._cards.length - 2,
            });

            if (index >= this._cards.length - 2) {
                card.instance.moveToTop();
            }
        });
    }

    private updateFlippedCards() {
        this._cards.forEach(c => {
            if (c.isFlipped === this._isFlipped) return;

            c.isFlipped = this._isFlipped;
        });
    }

    get id() {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get instance() {
        return this._deckGroup;
    }

    get for() {
        return this._for;
    }

    get isFlipped() {
        return this._isFlipped;
    }

    get parameters() {
        return this._parameters;
    }
}
