import * as React from 'react';
import { LanguageContext } from "../theme/LanguageSelect";
import { Modal, Box, Typography, ListItem, List, ListItemText } from '@mui/material';
import { GameData, RoundChange } from '../data';

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


export default function History(props: {
    openHistoryModal: boolean,
    setOpenHistoryModal: (value: boolean) => void,
    gameData: GameData | undefined
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
                <List>
                    {
                        props.gameData.rounds.reverse().map((round, idx) => {
                            return <ListItem key={round.time} secondaryAction={
                                idx == 0 ? (
                                    /*
                                    TODO: implement undo
                                    <Typography variant="body2">{'undo'}</Typography>
                                    */
                                    <></>
                                ) : <></>
                            } disableGutters>
                                <ListItemText
                                    sx={{ whiteSpace: 'pre-line' }}
                                    primary={`${i18n?.text.HISTORY_ROUND} ${props.gameData!.rounds.length - idx}${i18n?.text.HISTORY_ROUND_P2}, ${new Date(round.time).toLocaleString()}`}
                                    secondary={round.changes.map((change) => {
                                        return getScoreChange(change);
                                    }).join('\n')}
                                />
                            </ListItem>
                        })
                    }
                </List>
            </Box>
        </Modal>
    );
}