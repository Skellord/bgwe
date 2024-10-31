import { Deck } from './Deck.ts';
import { Card } from './Card.ts';
import { Text } from './Text.ts';
import { Button } from './Button.ts';
import { Stack } from './Stack.ts';

export class ObjectsStore {
    private _decks: Deck[] = [];
    private _cards: Card[] = [];
    private _texts: Text[] = [];
    private _buttons: Button[] = [];
    private _stacks: Stack[] = [];

    registerDeck(deck: Deck): void {
        this._decks.push(deck);
    }

    removeDeck(deck: Deck): void {
        this._decks = this._decks.filter(d => d.id !== deck.id);
    }

    registerCard(card: Card): void {
        this._cards.push(card);
    }

    removeCard(card: Card): void {
        this._cards = this._cards.filter(c => c.id !== card.id);
    }

    registerText(text: Text): void {
        this._texts.push(text);
    }

    registerButton(button: Button): void {
        this._buttons.push(button);
    }

    registerStack(stack: Stack): void {
        this._stacks.push(stack);
    }

    getDeckById(deckId: string): Deck | undefined {
        return this._decks.find(d => d.id === deckId);
    }

    getStackById(stackId: string): Stack | undefined {
        return this._stacks.find(s => s.id === stackId);
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

    get stacks() {
        return this._stacks;
    }

    clear(): void {
        this._decks = [];
        this._cards = [];
        this._texts = [];
        this._buttons = [];
        this._stacks = [];
    }
}
