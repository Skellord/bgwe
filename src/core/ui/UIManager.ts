import Konva from 'konva';

import { GameEngine } from '../GameEngine.ts';
import { KonvaEventObject } from 'konva/lib/Node';

export class UIManager {
    private _image: HTMLImageElement = new Image();
    private _tooltip: HTMLDivElement = document.createElement('div');
    private _stage: Konva.Stage;
    private _showingTimer: number | null = null;
    private _hidingTimer: number | null = null;
    private _lastCard: Konva.Node | null = null;

    constructor(gameEngine: GameEngine) {
        this._stage = gameEngine.stage;
        this.createZoomTooltip();
        this.subscribe();

        if (gameEngine.config.background) {
            document.body.style.background = gameEngine.config.background;
        }
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

    private createModal() {
        // const tem
    }

    private subscribe() {
        // this._stage.on('mouseover', this.mouseOverEventHandler.bind(this));
        this._stage.on('click', this.mouseOverEventHandler.bind(this));
        // this._stage.on('mousemove', () => {
        //     if (this._hidingTimer) return;
        //     if (this._showingTimer) return;
        //     console.log('object :>> ');

        //     this._hidingTimer = setTimeout(() => {
        //         this.hideZoomTooltip();
        //         clearTimeout(this._hidingTimer ?? undefined);
        //         this._hidingTimer = null;
        //     });
        // });
    }

    private openModal(url: string) {
        const modal = document.getElementById('bgwe-modal');
        const image = document.getElementById('bgwe-modal-image');
        const closeButton = document.getElementById('bgwe-modal-close-button');

        if (modal && image) {
            image.src = url;
            modal.style.display = 'block';
            closeButton?.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    }

    private mouseOverEventHandler(evt: KonvaEventObject<MouseEvent, Konva.Stage>) {
        if (evt.evt.button !== 0) return;
        if (evt.target instanceof Konva.Stage) {
            this.hideZoomTooltip();
            return;
        }

        const ancestors = evt.target.getAncestors();
        const card = ancestors.find(a => a.name().startsWith('card'));

        if (!card) return;
        // if (card.name() === this._lastCard?.name()) return;

        // this._lastCard = card;
        const url = card.toDataURL();
        this.openModal(url);
        // this._showingTimer = setTimeout(() => {
        //     this.showZoomTooltip(url, card.width(), card.height());
        // }, 1000);
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
            this._tooltip.style.left = position.x + 10 + 'px';
            this._tooltip.style.top = position.y + 10 + 'px';
            this._tooltip.style.display = 'block';
        }
    }

    hideZoomTooltip() {
        this._tooltip.style.display = 'none';
        this._lastCard = null;

        if (this._showingTimer) {
            clearTimeout(this._showingTimer);
            this._showingTimer = null;
        }
    }
}
