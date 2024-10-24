export class Utils {
    static throttle(cb: Function, ms: number) {
        let timer: number | null = null;

        return (...args: any[]) => {
            if (timer) return;

            timer = setTimeout(() => {
                cb(...args);
                clearTimeout(timer as number);
                timer = null;
            }, ms);
        };
    }

    static debounce(cb: Function, ms: number) {
        let timer: number | null = null;
        return (...args: any[]) => {
            clearTimeout(timer as number);
            timer = setTimeout(() => { cb.apply(this, args); }, ms);
            timer = null;
        };
    }

    static shuffleArray(array: Array<any>) {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
