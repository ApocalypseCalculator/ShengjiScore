import * as React from 'react';
import { LanguageContext } from "../theme/LanguageSelect";
import { Modal, Box, Typography, ListItem, List, ListItemText, Tooltip, IconButton } from '@mui/material';
import { Undo } from '@mui/icons-material';
import { GameData, Round, RoundChange } from '../data';

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
    maxWidth: 780,
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
                </Typography>
                {
                    props.gameData.rounds.length == 0 ? <Typography>{i18n?.text.NO_ROUNDS}</Typography> : <List>
                        {
                            props.gameData.rounds.map((round, idx) => {
                                return <ListItem key={round.time} secondaryAction={
                                    idx == 0 ? (
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
                                                primary={`${i18n?.text.HISTORY_ROUND} ${props.gameData!.rounds.length - idx}${i18n?.text.HISTORY_ROUND_P2}, ${new Date(round.time).toLocaleString()}`}
                                                secondary={round.changes.map((change) => {
                                                    return getScoreChange(change);
                                                }).join('\n')}
                                            /> :
                                            <Box>
                                                <ListItemText
                                                    sx={{ whiteSpace: 'pre-line' }}
                                                    primary={`${i18n?.text.HISTORY_ROUND} ${props.gameData!.rounds.length - idx}${i18n?.text.HISTORY_ROUND_P2}, ${new Date(round.time).toLocaleString()}`}
                                                />
                                                <ScoreTable data={round} getPlayerName={getPlayerName} />
                                            </Box>
                                    }
                                </ListItem>
                            })
                        }
                    </List>
                }
            </Box>
        </Modal>
    );
}