import { Deck } from './Deck.ts';
import { Card } from './Card.ts';
import { Text } from './Text.ts';
import { Button } from './Button.ts';

export class EntitiesStore {
    private _decks: Deck[] = [];
    private _cards: Card[] = [];
    private _texts: Text[] = [];
    private _buttons: Button[] = [];

    registerDeck(deck: Deck): void {
        this._decks.push(deck);
    }

    removeDeck(deck: Deck): void {
        this._decks.filter(d => d.id !== deck.id);
    }

    registerCard(card: Card): void {
        this._cards.push(card);
    }

    removeCard(card: Card): void {
        this._cards.filter(c => c.id !== card.id);
    }

    registerText(text: Text): void {
        this._texts.push(text);
    }

    registerButton(button: Button): void {
        this._buttons.push(button);
    }

    getDeck(deckId: string): Deck | undefined {
        return this._decks.find(d => d.id === deckId);
    }

    get decks() {
        return this._decks;
    }

    get cards(): Card[] {
        return this._cards;
    }

    get texts() {
        return this._texts;
    }

    get buttons() {
        return this._buttons;
    }

    clear(): void {
        this._decks = [];
        this._cards = [];
        this._texts = [];
        this._buttons = [];
    }
}