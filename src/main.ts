import { GameEngine } from './core';
import { Network } from './network';

const bgwe = {
    engine: GameEngine,
    network: Network,
}

export default bgwe;
export type { EngineConfig } from './core/GameEngine.ts';
export type { Entity } from './core';
