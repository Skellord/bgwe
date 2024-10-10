import { DeckEntity } from './types.ts';
import Konva from 'konva';
import { Card } from './Card.ts';

export class Deck {
    private readonly _deckGroup: Konva.Group;
    private readonly _deckFor: string;
    private _cards: Card[] = [];
    private _id: string;

    constructor(deckEntity: DeckEntity) {
        this._deckGroup = new Konva.Group({
            x: deckEntity.x,
            y: deckEntity.y,
            width: deckEntity.w,
            height: deckEntity.h,
            name: deckEntity.type,
        });

        const box = new Konva.Rect({
            width: deckEntity.w,
            height: deckEntity.h,
            stroke: 'blue',
            strokeWidth: 5,
        });

        this._deckGroup.add(box);
        this._deckFor = deckEntity.deckFor;
        this._id = deckEntity.id;
    }

    addCard(card: Card) {
        this._cards.push(card);
        card.instance.moveTo(this._deckGroup);

        card.instance.setPosition({
            x: 0,
            y: 0,
        });

        card.deck = this;
        this.updateVisibleCards();
    }

    removeCard(card: Card) {
        this._cards = this._cards.filter(c => c.id !== card.id);
        card.deck = null;
        this.updateVisibleCards();
    }

    private updateVisibleCards() {
        this._cards.forEach(((card, index) => {
            card.instance.setAttrs({
                visible: index < 2,
                listening: index < 2,
            });
        }));
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
}