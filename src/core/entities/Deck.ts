import Konva from 'konva';

import { DeckEntity } from './types.ts';
import { Card } from './Card.ts';
import { EventBus, EventTypes } from '../events';
import { shuffleArray } from '../utils/shuffleArray.ts';

export class Deck {
    private readonly _deckGroup: Konva.Group;
    private readonly _deckFor: string;
    private _cards: Card[] = [];
    private _id: string;
    private _isFlipped: boolean;
    private _eventBus: EventBus;

    constructor(deckEntity: DeckEntity, eventBus: EventBus) {
        this._eventBus = eventBus;
        this._deckGroup = new Konva.Group({
            x: deckEntity.x,
            y: deckEntity.y,
            width: deckEntity.w,
            height: deckEntity.h,
            name: deckEntity.type,
            offset: {
                x: deckEntity.w / 2,
                y: deckEntity.h / 2,
            },
        });

        const box = new Konva.Rect({
            width: deckEntity.w,
            height: deckEntity.h,
            stroke: deckEntity.stroke,
            strokeWidth: deckEntity.strokeWidth,
            fill: deckEntity.fill,
        });

        this._isFlipped = deckEntity.isFlipped;
        this._deckGroup.add(box);
        this._deckFor = deckEntity.deckFor;
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
        card.deck = this;
        this.updateVisibleCards();
    }

    flip() {
        this._isFlipped = !this._isFlipped;
        this.updateFlippedCards();
    }

    removeCard(card: Card) {
        this._cards = this._cards.filter(c => c.id !== card.id);
        card.deck = null;
        card.indexInDeck = null;
        this.updateVisibleCards();
    }

    rotate(deg: number) {
        this._deckGroup.rotate(deg);
    }

    shuffle() {
        shuffleArray(this._cards);
        this._cards.forEach((c, index) => {
            c.indexInDeck = index;
        });
        this.updateVisibleCards();
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
                visible: index < 2,
                listening: index < 2,
            });

            if (index < 2) {
                card.instance.moveToTop();
            }
        });

        this.updateFlippedCards();
    }

    private updateFlippedCards() {
        for (let i = 0; i < 2; i++) {
            if (this._cards[i]) {
                this._cards[i].isFlipped = this._isFlipped;
            }
        }
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

    get deckFor() {
        return this._deckFor;
    }

    get isFlipped() {
        return this._isFlipped;
    }
}
