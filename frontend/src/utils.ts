import { Player } from "./data";

export function getCardImgUrl(num: number, idx: number): string {
    let suit = ['s', 'h', 'c', 'd'][idx % 4];
    return `/svg/${suit}${num}.svg`;
}

export function getCardStr(num: number): string {
    if(num == 1 || num == 14) {
        return 'A';
    }
    if(num == 11) {
        return 'J';
    }
    if(num == 12) {
        return 'Q';
    }
    if(num == 13) {
        return 'K';
    }
    return num.toString();
}

export function getNextScore(player: Player, add: boolean): Player {
    let nplayer = {...player};
    if(add) {
        if(player.score < 14) {
            nplayer.score++;
            return nplayer;
        }
        nplayer.score = player.round+2;
        nplayer.round++;
        return nplayer;
    }
    else {
        if(player.score > player.round + 1) {
            nplayer.score--;
            return nplayer;
        }
        nplayer.score = 14;
        nplayer.round--;
        return nplayer;
    }
}
