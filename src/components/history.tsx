import * as React from 'react';
import { LanguageContext } from "../theme/LanguageSelect";
import { Modal, Box, Typography, ListItem, List, ListItemText, Tooltip, IconButton } from '@mui/material';
import { Undo, Close } from '@mui/icons-material';
import { GameData, Round, RoundChange, GameLog, GameLogType } from '../data';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95vw',
    maxWidth: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function ScoreTable(props: {
    data: Round,
    getPlayerName: (id: number) => string,
}) {
    const i18n = React.useContext(LanguageContext);
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                        <TableCell>{i18n?.text.PLAYERS}</TableCell>
                        {
                            props.data.changes.map((col) => {
                                return <TableCell align="right">{props.getPlayerName(col.id)}</TableCell>
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                        key={props.data.time}
                        sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                    >
                        <TableCell>{i18n?.text.SCORE_CHANGE_L}</TableCell>
                        {
                            props.data.changes.map((col) => {
                                return <TableCell align="right">{col.schange}</TableCell>
                            })
                        }
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

interface Event {
    type: 'log' | 'round';
    position: number;
    data: GameLog | Round;
    strdata: string;
}

const DATETIME_FORMAT = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
})

export default function History(props: {
    smallScreen: boolean,
    openHistoryModal: boolean,
    setOpenHistoryModal: (value: boolean) => void,
    gameData: GameData | undefined,
    undoRound: (r: Round) => void
}) {
    const i18n = React.useContext(LanguageContext);
    function getPlayerName(id: number) {
        if (!props.gameData) {
            return '';
        }
        for (let i = 0; i < props.gameData.players.length; i++) {
            if (props.gameData.players[i].id === id) {
                return props.gameData.players[i].name;
            }
        }
        return i18n?.text.DELETED_PLAYER;
    }
    function getScoreChange(change: RoundChange) {
        let str = `${getPlayerName(change.id)}: `;
        if (change.rchange != 0) {
            str += `${i18n?.text.ROUND_CHANGE} ${change.rchange > 0 ? '+' : ''}${change.rchange}, `;
        }
        str += `${i18n?.text.SCORE_CHANGE} ${change.schange >= 0 ? '+' : ''}${change.schange}`;
        return str;
    }
    function getPrettyDate(time: number): string {
        return DATETIME_FORMAT.format(new Date(time));
    }
    function getGameLogString(log: GameLog): string {
        if (log.type == GameLogType.PLAYER_RENAME) {
            return `${getPlayerName(log.user!)}: ${i18n?.text.PLAYER_RENAME} ${log.oldname} -> ${log.newname}`;
        }
        else if (log.type == GameLogType.PLAYER_ADD) {
            return `${getPlayerName(log.user!)}: ${i18n?.text.PLAYER_ADD} ${log.oldname}`;
        }
        else if (log.type == GameLogType.PLAYER_DELETE) {
            return `${log.oldname}: ${i18n?.text.PLAYER_DELETE}`;
        }
        else if (log.type == GameLogType.GAME_RENAME) {
            return `${i18n?.text.GAME_RENAME}: ${log.oldname} -> ${log.newname}`;
        }
        else if (log.type == GameLogType.GAME_CREATE) {
            return `${i18n?.text.GAME_CREATE}: ${log.oldname}`;
        }
        else if (log.type == GameLogType.GAME_UNDO) {
            return `${i18n?.text.GAME_UNDO}`;
        }
        return 'unknown log'
    }

    const [totalEvents, setTotalEvents] = React.useState([] as Event[]);
    React.useEffect(() => {
        if (!props.gameData) {
            return;
        }
        const events: Event[] = props.gameData.logs.map((log, i) => {
            return { type: 'log', data: log, position: i + 1, strdata: getGameLogString(log) };
        });
        props.gameData.rounds.forEach((round, i) => {
            events.push({ type: 'round', data: round, position: i + 1, strdata: '' });
        });
        events.sort((a, b) => {
            return a.data.time - b.data.time;
        });
        // events now ordered from oldest to newest
        // coalesce logs if they are within 30 seconds of each other
        // do NOT coalesce logs if they are separated by a round
        for (let i = events.length - 2; i >= 0; i--) {
            if (events[i].type == 'log' && events[i + 1].type == 'log') {
                if (Math.abs(events[i].data.time - events[i + 1].data.time) < 30000) {
                    events[i + 1].position = events[i].position;
                    events[i + 1].strdata += '\n' + events[i].strdata;
                    events.splice(i, 1);
                }
            }
        }
        events.reverse();
        setTotalEvents(events);
    }, [props.gameData]);

    if (!props.gameData) {
        return <></>;
    }
    return (
        <Modal
            open={props.openHistoryModal}
            onClose={() => {
                props.setOpenHistoryModal(false);
            }}
            keepMounted
        >
            <Box sx={style} display={'flex'} flexDirection={'column'} gap={2}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {i18n?.text.HISTORY}
                    {
                        props.smallScreen ?
                            <IconButton sx={{ position: 'absolute', top: '29px', right: '32px' }} size={'small'} onClick={() => {
                                props.setOpenHistoryModal(false);
                            }}>
                                <Close />
                            </IconButton> : <></>
                    }
                </Typography>
                {
                    totalEvents.length == 0 ? <Typography>{i18n?.text.NO_HISTORY}</Typography> : <List sx={{overflowY: 'scroll', maxHeight: '80vh'}}>
                        {
                            totalEvents.map((event) => {
                                if (event.type == 'round') {
                                    let round = event.data as Round;
                                    return <ListItem sx={props.smallScreen ? {
                                        paddingTop: 0,
                                        paddingBottom: 0
                                    } : {}} key={round.time} secondaryAction={
                                        event.position == props.gameData?.rounds.length ? (
                                            <Tooltip sx={{ opacity: 1 }} title={i18n?.text.UNDO}>
                                                <IconButton size={'small'} edge="end" aria-label="add" onClick={() => {
                                                    props.undoRound(round);
                                                }}>
                                                    <Undo />
                                                </IconButton>
                                            </Tooltip>
                                        ) : <></>
                                    } disableGutters>
                                        {
                                            props.smallScreen ?
                                                <ListItemText
                                                    sx={{ whiteSpace: 'pre-line' }}
                                                    primary={`${i18n?.text.HISTORY_ROUND} ${event.position}${i18n?.text.HISTORY_ROUND_P2} — ${getPrettyDate(round.time)}`}
                                                    secondary={round.changes.map((change) => {
                                                        return getScoreChange(change);
                                                    }).join('\n')}
                                                /> :
                                                <Box>
                                                    <ListItemText
                                                        sx={{ whiteSpace: 'pre-line' }}
                                                        primary={`${i18n?.text.HISTORY_ROUND} ${event.position}${i18n?.text.HISTORY_ROUND_P2} — ${getPrettyDate(round.time)}`}
                                                    />
                                                    <ScoreTable data={round} getPlayerName={getPlayerName} />
                                                </Box>
                                        }
                                    </ListItem>
                                }
                                else if (event.type == 'log') {
                                    return <ListItem sx={props.smallScreen ? {
                                        paddingTop: 0,
                                        paddingBottom: 0
                                    } : {}} key={event.data.time} disableGutters>
                                        <ListItemText
                                            sx={{ whiteSpace: 'pre-line' }}
                                            primary={`${i18n?.text.LOG} — ${getPrettyDate(event.data.time)}`}
                                            secondary={event.strdata}
                                        />
                                    </ListItem>
                                }
                            })
                        }
                    </List>
                }
            </Box>
        </Modal>
    );
}