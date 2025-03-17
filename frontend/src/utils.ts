import { Player } from "./data";

export function getCardImgUrl(player: Player, idx: number): string {
    let suit = ['s', 'h', 'c', 'd'][idx % 4];
    if(hasPenalty(player) > 0) {
        return `/svg/${suit}2.svg`;
    }
    if(hasWin(player) > 0) {
        return `/svg/${suit}14.svg`;
    }
    return `/svg/${suit}${player.score}.svg`;
}

export function getCardStr(player: Player): string {
    if(hasWin(player) || player.score == 14) {
        return 'A';
    }
    if(hasPenalty(player)) {
        return '2';
    }
    if(player.score == 11) {
        return 'J';
    }
    if(player.score == 12) {
        return 'Q';
    }
    if(player.score == 13) {
        return 'K';
    }
    return player.score.toString();
}

export function getNextScore(player: Player, add: boolean): Player {
    let nplayer = {...player};
    if(add) {
        // special case for when player has passed the "win" condition
        if(player.round == 13) {
            nplayer.score++;
            return nplayer;
        }

        if(player.score < 14) {
            nplayer.score++;
            return nplayer;
        }
        nplayer.score = player.round+2;
        nplayer.round++;
        return nplayer;
    }
    else {
        // special case for when player has penalty below minimum
        if(player.round == 1 && player.score <= 2) {
            nplayer.score--;
            return nplayer;
        }

        if(player.score > player.round + 1) {
            nplayer.score--;
            return nplayer;
        }
        nplayer.score = 14;
        nplayer.round--;
        return nplayer;
    }
}

export function hasPenalty(player: Player): number {
    if(player.round == 1 && player.score < 2) {
        return 2 - player.score
    }
    else {
        return 0;
    }
}

export function hasWin(player: Player): number {
    if(player.round == 13 && player.score > 14) {
        return player.score - 14;
    }
    else {
        return 0;
    }
}
