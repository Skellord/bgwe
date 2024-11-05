import Konva from 'konva';

import { DeckEntity } from './types.ts';
import { Card } from './Card.ts';
import { Utils } from '../utils/index.ts';

export class Deck extends Konva.Group {
    private readonly _for: string;
    private _cards: Card[] = [];
    private _isFlipped: boolean;
    private _counter?: Konva.Text;
    private _parameters: DeckEntity;

    constructor(deckEntity: DeckEntity) {
        super({
            x: deckEntity.x,
            y: deckEntity.y,
            width: deckEntity.w,
            height: deckEntity.h,
            id: deckEntity.id,
            name: `${deckEntity.type}`,
            rotation: deckEntity.rotation,
            offset: {
                x: Math.round(deckEntity.w / 2),
                y: Math.round(deckEntity.h / 2),
            },
        });

        this._parameters = deckEntity;

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

            this.add(this._counter);
        }

        this._isFlipped = deckEntity.isFlipped;
        this.add(box);
        this._for = deckEntity.for;

        this.on('contextmenu', eventData => {
            eventData.evt.preventDefault();
            this.getStage()?.fire('deckcontextmenu', { target: this });
        });
    }

    addCard(card: Card) {
        if (card.indexInDeck) {
            this._cards.splice(card.indexInDeck, 0, card);
        } else {
            this._cards.push(card);
            card.indexInDeck = this._cards.length - 1;
        }

        this.add(card);
        const absolutePos = this.getAbsolutePosition();
        card.setAbsolutePosition(absolutePos);
        card.rotate(0);
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
        console.log(card, this._cards);
        this._cards = this._cards.filter(c => c.id() !== card.id());
        card.indexInDeck = null;
        this.updateCardIndexes();
        this.updateVisibleCards();
        this.updateCounter();
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

    private updateVisibleCards() {
        this._cards.forEach((card, index) => {
            card.setAttrs({
                visible: index >= this._cards.length - 2,
                listening: index >= this._cards.length - 2,
            });

            if (index >= this._cards.length - 2) {
                card.moveToTop();
            }
        });
    }

    private updateFlippedCards() {
        this._cards.forEach(c => {
            if (c.isFlipped === this._isFlipped) return;

            c.isFlipped = this._isFlipped;
        });
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
