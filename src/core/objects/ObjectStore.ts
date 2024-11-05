import { Deck } from './Deck.ts';
import { Card } from './Card.ts';
import { Text } from './Text.ts';
import { Button } from './Button.ts';
import { Stack } from './Stack.ts';
import { GameObject } from './index.ts';

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
        return this._decks.find(d => d.id() === deckId);
    }

    getStackById(stackId: string): Stack | undefined {
        return this._stacks.find(s => s.id() === stackId);
    }

    getCardById(cardId: string): Card | undefined {
        return this._cards.find(c => c.id() === cardId);
    }

    getTextById(textId: string): Text | undefined {
        return this._texts.find(t => t.id() === textId);
    }

    getButtonById(buttonId: string): Button | undefined {
        return this._buttons.find(b => b.id() === buttonId);
    }

    getById(id: string): GameObject | null {
        const card = this.getCardById(id);
        if (card) return card;
        const deck = this.getDeckById(id);
        if (deck) return deck;
        const stack = this.getStackById(id);
        if (stack) return stack;
        const text = this.getTextById(id);
        if (text) return text;
        const button = this.getButtonById(id);
        if (button) return button;

        return null;
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
