import Konva from 'konva';

import { GameEngine } from '../GameEngine.ts';

export class MenuEventsHandler {
    private _stage: Konva.Stage;
    private readonly _menu: HTMLElement | null = null;
    protected _rotateAngle: number = 90;

    constructor(gameEngine: GameEngine, menuId: string) {
        this._stage = gameEngine.stage;
        this._menu = document.getElementById(menuId);

        if (gameEngine.config.settings?.rotateAngle) {
            this._rotateAngle = gameEngine.config.settings.rotateAngle;
        }

        window.addEventListener('click', () => {
            if (!this._menu) return;
            this._menu.style.display = 'none';
        });
    }

    protected showMenu() {
        if (!this._menu) return;
        const stageRect = this._stage.container().getBoundingClientRect();
        this._menu.style.top = stageRect.top + (this._stage.getPointerPosition()?.y ?? 0) + 4 + 'px';
        this._menu.style.left = stageRect.left + (this._stage.getPointerPosition()?.x ?? 0) + 4 + 'px';
        this._menu.style.display = 'initial';
    }
}
