import * as React from 'react';
import { PlayerList, PlayerListItem } from '../styled';
import { MenuItem, ListItemAvatar, ListItemText, IconButton, Menu, Chip, Typography, Box, Tooltip, Badge } from '@mui/material';
import { Remove, Add, MoreVert } from '@mui/icons-material';

import { LanguageContext } from '../theme/LanguageSelect';
import { GameData, Player } from '../data';

import { getCardImgUrl, getCardStr, hasPenalty, hasWin } from '../utils';

import NameEditor from './nameeditor';

export default function GamePlayerList(props: {
    smallScreen: boolean;
    showList: boolean;
    currentGameData: GameData | undefined;
    currentWinner: number;
    updatePlayerName: (player: number, name: string) => void;
    deletePlayer: (player: number) => void;
    addScore: (player: number, add: boolean) => void;
    editingScores: boolean;
}) {
    const i18n = React.useContext(LanguageContext);

    const [editingPlayerName, setEditingPlayerName] = React.useState(-1);
    const [editingPlayerNameValue, setEditingPlayerNameValue] = React.useState("");

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openPlayerMenu, setOpenPlayerMenu] = React.useState(-1);
    const handleOpenPlayerMenu = (idx: number, event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenPlayerMenu(idx);
    };
    const handleClosePlayerMenu = () => {
        setAnchorEl(null);
        setOpenPlayerMenu(-1);
    };

    if (!props.showList || !props.currentGameData) {
        return <></>;
    }

    return (
        <PlayerList dense={props.smallScreen}>
            {
                props.currentGameData.players.map((player: Player, i) => {
                    return (
                        <PlayerListItem
                            key={i}
                            secondaryAction={
                                editingPlayerName != i ?
                                    <Box display={'flex'} gap={props.smallScreen ? 1 : 3}>
                                        {
                                            props.editingScores ? <>
                                                <Tooltip sx={{opacity: 1}} title={i18n?.text.ADD_LEVEL}>
                                                    <IconButton size={props.smallScreen ? 'small' : 'medium'} edge="end" aria-label="add" onClick={() => {
                                                        props.addScore(i, true);
                                                    }}>
                                                        <Add />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={i18n?.text.SUBTRACT_LEVEL}>
                                                    <IconButton size={props.smallScreen ? 'small' : 'medium'} edge="end" aria-label="remove" onClick={() => {
                                                        props.addScore(i, false);
                                                    }}>
                                                        <Remove />
                                                    </IconButton>
                                                </Tooltip>
                                            </> : <Tooltip title={i18n?.text.MORE_OPTIONS}>
                                                <IconButton size={props.smallScreen ? 'small' : 'medium'} edge="end" aria-label="moreoptions" onClick={(ev) => {
                                                    handleOpenPlayerMenu(i, ev);
                                                }}>
                                                    <MoreVert />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={openPlayerMenu === i}
                                            onClose={handleClosePlayerMenu}
                                        >
                                            <MenuItem onClick={() => {
                                                setEditingPlayerName(i);
                                                setEditingPlayerNameValue(player.name);
                                                handleClosePlayerMenu();
                                            }}>{i18n?.text.EDIT_NAME}</MenuItem>
                                            <MenuItem onClick={() => {
                                                handleClosePlayerMenu();
                                                props.deletePlayer(i);
                                            }}>{i18n?.text.DELETE}</MenuItem>
                                        </Menu>
                                    </Box> : <></>
                            }
                        >
                            <ListItemAvatar>
                                <img className='card' src={getCardImgUrl(player, i)}>
                                </img>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ marginLeft: '1rem' }}
                                primary={
                                    editingPlayerName == i ?
                                        <NameEditor
                                            editingNameValue={editingPlayerNameValue}
                                            setEditingNameValue={setEditingPlayerNameValue}
                                            editingNameError={false}
                                            useHelperText={false}
                                            editFieldId='player-name-edit'
                                            label={i18n?.text.PLAYER_NAME}
                                            updateNameAction={() => {
                                                props.updatePlayerName(i, editingPlayerNameValue);
                                                setEditingPlayerName(-1);
                                            }}
                                            handleCancelEditPress={() => {
                                                setEditingPlayerName(-1);
                                            }}
                                        />
                                        :
                                        <Badge className={"leader-badge"} badgeContent={i18n?.text.LEAD} color="secondary" invisible={props.currentWinner !== i}>
                                            <Typography variant="h6" component="div">
                                                {player.name}
                                            </Typography>
                                        </Badge>

                                }
                                secondary={<Typography style={{ fontWeight: 'normal' }} variant="body2" component="div">
                                    {i18n?.text.ROUND_P1} {player.round}{i18n?.text.ROUND_P2}, {i18n?.text.PLAYING} {getCardStr(player)}
                                    {
                                        hasPenalty(player) > 0 ? <>
                                            <Typography variant="caption" component="span">
                                                -{hasPenalty(player)}
                                            </Typography>
                                            <div>
                                                <Chip label={i18n?.text.PENALTY} color="error" />
                                            </div></> : <></>
                                    }
                                    {
                                        hasWin(player) > 0 ? <>
                                            <Typography variant="caption" component="span">
                                                +{hasWin(player)}
                                            </Typography>
                                            <div>
                                                <Chip label={i18n?.text.WIN} color="success" />
                                            </div></> : <></>
                                    }
                                </Typography>}
                            />
                        </PlayerListItem>
                    )
                })
            }
        </PlayerList>
    );
}