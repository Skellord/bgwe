export interface EntityProps {
    id: string;
    type: EntityType;
    w: number;
    h: number;
    x: number;
    y: number;
    rotation?: number;
}

export type EntityType = 'card' | 'deck' | 'text' | 'button' | 'stack';

export interface CardEntity extends EntityProps {
    type: 'card';
    name: string;
    front: BasicEntity[];
    back: BasicEntity[];
    isFlipped: boolean;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    cornerRadius?: number;
    parentId?: string;
    indexInDeck?: number;
}

export interface DeckEntity extends EntityProps {
    type: 'deck';
    for: string;
    isFlipped: boolean;
    withCount?: boolean;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}

export interface TextEntity extends EntityProps {
    type: 'text';
    value: string;
    listeningParam?: string;
}

export interface ButtonEntity extends EntityProps {
    type: 'button';
    text: string;
    fill?: string;
}

export interface StackEntity extends EntityProps {
    type: 'stack';
    for: string;
    stroke?: string;
}

export type Entity = CardEntity | DeckEntity | TextEntity | ButtonEntity | StackEntity;

export interface EntitiesConfig {
    decks?: DeckEntity[];
    stacks?: StackEntity[];
    cards?: CardEntity[];
    buttons?: ButtonEntity[];
    texts?: TextEntity[];
}

export type BasicEntityType = 'image' | 'rectangle';

export interface BasicEntityProps {
    x: number;
    y: number;
    type: BasicEntityType;
    id: string;
    w: number;
    h: number;
}

export interface ImageEntity extends BasicEntityProps {
    src: string;
    type: 'image';
}

export interface RectangleEntity extends BasicEntityProps {
    type: 'rectangle';
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    rotation?: number;
}

export type BasicEntity = ImageEntity | RectangleEntity;
