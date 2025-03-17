import { uniqueNamesGenerator, Config, adjectives, colors, starWars } from 'unique-names-generator';
import { saveAs } from 'file-saver';

const LOCAL_STORAGE_KEY = 'gameData';

let timeoutId: number | null = null;
const debounce = (callback: any, wait: number) => {
    return (...args: any[]) => {
        if (typeof timeoutId === 'number') {
            window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

export class GameDataMap extends Map<string, GameData> {
    constructor() {
        super();
        super.get
    }
    set(key: string, value: GameData) {
        let ret = super.set(key, value);
        this.writeToStorage();
        return ret;
    }
    clear() {
        super.clear();
        this.writeToStorage();
        return
    }
    delete(key: string) {
        let ret = super.delete(key);
        this.writeToStorage();
        return ret;
    }
    private stringify() {
        let rawdata: RawGameData[] = [];
        this.forEach((value, key) => {
            rawdata.push({ name: key, data: value });
        });
        return JSON.stringify(rawdata);
    }
    loadFromStorage() {
        this.clear();
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            let rawdata: RawGameData[] = JSON.parse(stored);
            rawdata.forEach((raw) => {
                this.set(raw.name, raw.data);
            });
        }
    }
    private writeToStorage() {
        debounce(() => {
            localStorage.setItem(LOCAL_STORAGE_KEY, this.stringify());
        }, 500)();
    }
    export() {
        let blob = new Blob([this.stringify()], {type: "application/json;charset=utf-8"});
        saveAs(blob, "gamedata.json");
    }
    import(rawdata: RawGameData[]) {
        this.clear();
        rawdata.forEach((raw) => {
            this.set(raw.name, raw.data);
        });
        this.writeToStorage();
    }
}

export function initGameData() {
    let gamedata: GameData;
    gamedata = {
        description: '',
        players: []
    }
    gamedata.players = Array.from(Array(4)).map(() => {
        return createPlayer();
    })
    return gamedata;
}

export function createPlayer() {
    return {
        name: uniqueNamesGenerator({
            dictionaries: [starWars],
            separator: ' '
        }),
        score: 2,
        round: 1
    } as Player;
}

type RawGameData = {
    name: string;
    data: GameData;
}

export type GameData = {
    description: string;
    players: Player[];
}

export type Player = {
    name: string;
    score: number;
    round: number;
}
