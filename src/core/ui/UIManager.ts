import Konva from 'konva';

import { GameEngine } from '../GameEngine.ts';
import { KonvaEventObject } from 'konva/lib/Node';
import { Utils } from '../utils';

export class UIManager {
    private _image: HTMLImageElement = new Image();
    private _tooltip: HTMLDivElement = document.createElement('div');
    private _stage: Konva.Stage;

    constructor(gameEngine: GameEngine) {
        this._stage = gameEngine.stage;
        this.createZoomTooltip();
        this.subscribe();
    }

    private createZoomTooltip() {
        this._tooltip.style.position = 'absolute';
        this._tooltip.style.width = '400px';
        this._tooltip.style.height = '800px';
        this._tooltip.style.display = 'none';

        this._image.style.width = '100%';
        this._image.style.height = '100%';
        this._tooltip.appendChild(this._image);

        document.body.appendChild(this._tooltip);
    }

    private subscribe() {
        this._stage.on('mouseover', Utils.debounce(this.mouseOverEventHandler.bind(this), 1000));
    }

    private mouseOverEventHandler(evt: KonvaEventObject<MouseEvent, Konva.Stage>) {
        if (evt.target instanceof Konva.Stage) {
            this.hideZoomTooltip();
            return;
        }

        const ancestors = evt.target.getAncestors();
        const card = ancestors.find(a => a.name().startsWith('card'));

        if (!card) return;

        const url = card.toDataURL();
        this.showZoomTooltip(url, card.width(), card.height());
    }

    showZoomTooltip(url: string, width?: number, height?: number) {
        if (!url) return;

        this._image.src = url;
        const position = this._stage.getPointerPosition();

        if (width && height) {
            this._tooltip.style.width = width * 2 + 'px';
            this._tooltip.style.height = height * 2 + 'px';
        }

        if (position) {
            this._tooltip.style.left = position.x + 5 + 'px';
            this._tooltip.style.top = position.y + 5 + 'px';
            this._tooltip.style.display = 'block';
        }
    }

    hideZoomTooltip() {
        this._tooltip.style.display = 'none';
    }
}
