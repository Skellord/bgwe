import bgwe, { EngineConfig } from '../src/main';

const config: EngineConfig = {
    entities: {
        cards: [
            {
                type: 'card',
                name: 'default',
                back: [
                    {
                        type: 'image',
                        src: '/public/120.webp',
                        y: 0,
                        x: 0,
                        w: 80,
                        h: 80,
                        id: 'image1',
                    },
                ],
                front: [
                    {
                        type: 'image',
                        src: '/public/vite.svg',
                        y: 0,
                        x: 0,
                        w: 80,
                        h: 80,
                        id: 'image2',
                    },
                ],
                h: 100,
                w: 100,
                y: 100,
                x: 100,
                id: '1',
                isFlipped: true,
                stroke: 'black',
            },
            {
                type: 'card',
                name: 'default',
                back: [],
                front: [],
                h: 100,
                w: 100,
                y: 100,
                x: 100,
                id: '2',
                isFlipped: false,
                fill: 'red',
            },
            {
                type: 'card',
                name: 'default',
                back: [],
                front: [],
                h: 100,
                w: 100,
                y: 100,
                x: 100,
                id: '_6',
                isFlipped: false,
                fill: 'blue',
            },
        ],
        decks: [
            {
                type: 'deck',
                isFlipped: false,
                w: 100,
                h: 100,
                x: 500,
                y: 500,
                id: 'deck0',
                for: 'default',
                stroke: 'red',
                withCount: true,
            },
        ],
        buttons: [
            {
                type: 'button',
                w: 150,
                h: 100,
                x: 550,
                y: 300,
                fill: 'red',
                text: '+',
                id: 'button1',
            },
        ],
        stacks: [
            {
                type: 'stack',
                w: 500,
                h: 300,
                x: 600,
                y: 600,
                for: 'default',
                id: '_123',
                stroke: 'green',
            },
        ],
        texts: [
            {
                type: 'text',
                w: 100,
                h: 100,
                x: 300,
                y: 300,
                value: 'text',
                id: 'text1',
                listeningParam: 'first',
            },
        ],
    },
    name: 'a',
    background: 'grey',
    version: '1.0.0',
    rules: {
        params: {
            first: 1,
        },
        actions: [
            {
                name: 'action',
                targetId: 'button1',
                handler: evt => {
                    const param = evt.paramsStore.getParameter('first');
                    console.log('action', param);
                    if (typeof param === 'number') {
                        // const num = parseInt(param);
                        evt.paramsStore.changeParameter('first', param + 1);
                    }
                },
                on: 'buttonclick',
            },
        ],
    },
};

const network = new bgwe.network();
network.init();
const adapter = network.getNetworkAdapter();
const engine = new bgwe.engine(config, adapter);
engine.init();
