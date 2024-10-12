import { GameEngine } from '../GameEngine.ts';
import { EntitiesStore } from './EntitiesStore.ts';
import { Entity } from './types.ts';
import { Deck } from './Deck.ts';
import { Card } from './Card.ts';
import { Text } from './Text.ts';
import { Button } from './Button.ts';
import Konva from 'konva';
import { EventBus } from '../events';

export class EntitiesController {
    private _entitiesStore: EntitiesStore = new EntitiesStore();
    private _mainLayer: Konva.Layer;
    private readonly _eventBus: EventBus;

    constructor(gameEngine: GameEngine) {
        this._mainLayer = gameEngine.mainLayer;
        this._eventBus = gameEngine.eventBus;
    }

    private renderDecks() {
        this._entitiesStore.decks.forEach(d => {
            this._mainLayer.add(d.instance);
        });
    }

    private renderCards() {
        this._entitiesStore.cards.forEach(c => {
            if (!c.deck) {
                this._mainLayer.add(c.instance);
            }
        });
    }

    private renderTexts() {
        this._entitiesStore.texts.forEach(t => {
            this._mainLayer.add(t.instance);
        });
    }

    private renderButtons() {
        this._entitiesStore.buttons.forEach(b => {
            this._mainLayer.add(b.instance);
        });
    }

    renderEntities() {
        this.renderTexts();
        this.renderButtons();
        this.renderDecks();
        this.renderCards();
    }

    addEntity(entity: Entity) {
        if (entity.type === 'deck') {
            const deck = new Deck(entity);
            this._entitiesStore.registerDeck(deck);
        }

        if (entity.type === 'card') {
            const card = new Card(entity, this._eventBus);
            if (entity.deckId) {
                const deck = this._entitiesStore.getDeck(entity.deckId);

                if (deck) {
                    deck.addCard(card);
                }
            }
            this._entitiesStore.registerCard(card);
        }

        if (entity.type === 'text') {
            const text = new Text(entity, this._eventBus);
            this._entitiesStore.registerText(text);
        }

        if (entity.type === 'button') {
            const button = new Button(entity, this._eventBus);
            this._entitiesStore.registerButton(button);
        }
    }

    destroyEntities() {
        this._entitiesStore.clear();
    }

    get cards() {
        return this._entitiesStore.cards;
    }

    get decks() {
        return this._entitiesStore.decks;
    }
}
