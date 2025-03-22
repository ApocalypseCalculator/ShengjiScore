import * as React from 'react';
import { Card, GameDataContainer, VisuallyHiddenInput, PlayerList, PlayerListItem, BottomBox } from './styled';
import AppTheme from './theme/AppTheme';
import { Select, InputLabel, MenuItem, ListItemAvatar, ListItemText, IconButton, Menu, TextField, FormControl, Divider, Chip, CssBaseline, Typography, Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Tooltip, Badge } from '@mui/material';
import { Delete, Remove, Add, Edit, Check, Close, FileUpload, FileDownload, AddBox, MoreVert } from '@mui/icons-material';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { GameDataMap, GameData, Player, initGameData, createPlayer } from './data';

import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { getCardImgUrl, getNextScore, getCardStr, hasPenalty, hasWin, getWinningPlayerIdx } from './utils';

import { LanguageContext } from './theme/LanguageSelect';

import Settings from './components/settings';

const GLOBAL_GAME_DATA = new GameDataMap();

export default function ScoreCounter(props: { disableCustomTheme?: boolean }) {
    const i18n = React.useContext(LanguageContext);
    const [currentGameData, setCurrentGameData] = React.useState<GameData>();
    const [gameKeys, setGameKeys] = React.useState<string[]>([]);
    const [currentGame, setCurrentGame] = React.useState("");
    const [editingName, setEditingName] = React.useState(false);
    const [editingNameValue, setEditingNameValue] = React.useState("");
    const [editingNameError, setEditingNameError] = React.useState(false);
    const [editingPlayerName, setEditingPlayerName] = React.useState(-1);
    const [editingPlayerNameValue, setEditingPlayerNameValue] = React.useState("");

    const [currentWinner, setCurrentWinner] = React.useState(-1);

    const [openLoadError, setOpenLoadError] = React.useState(false);

    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

    function initScoreboard() {
        let gamekeys = Array.from(GLOBAL_GAME_DATA.keys()).reverse();
        setGameKeys(gamekeys);
        if (gamekeys.length > 0) {
            setCurrentGame(gamekeys[0]);
            setCurrentGameData(GLOBAL_GAME_DATA.get(gamekeys[0]));
        }
    }

    React.useEffect(() => {
        GLOBAL_GAME_DATA.loadFromStorage();
        initScoreboard();
    }, []);

    React.useEffect(() => {
        if (currentGameData) {
            setCurrentWinner(getWinningPlayerIdx(currentGameData.players));
        }
        else {
            setCurrentWinner(-1);
        }
    }, [currentGameData]);

    function updateCurrentGame(game: string) {
        if (game === "New Game") {
            const randomName: string = uniqueNamesGenerator({
                dictionaries: [adjectives, adjectives, colors, animals]
            });
            setGameKeys((prev) => [randomName, ...prev]);
            setCurrentGame(randomName);
            let newdata = initGameData();
            setCurrentGameData(newdata);
            GLOBAL_GAME_DATA.set(randomName, newdata);
        }
        else {
            setCurrentGame(game);
            setCurrentGameData(GLOBAL_GAME_DATA.get(game));
        }
    }

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

    function updateGameName(name: string): boolean {
        if (name === currentGame) {
            return true;
        }
        if (gameKeys.includes(name)) {
            return false;
        }
        setGameKeys((prev) => {
            if (!prev.includes(currentGame) || !currentGameData) {
                return prev;
            }
            let idx = prev.indexOf(currentGame);
            GLOBAL_GAME_DATA.delete(currentGame);
            GLOBAL_GAME_DATA.set(name, currentGameData);
            prev[idx] = name;
            setCurrentGame(name);
            return prev;
        });
        return true;
    }

    function updatePlayerName(idx: number, name: string) {
        setCurrentGameData((prev) => {
            if (!prev) return prev;
            let newstate = { ...prev };
            newstate.players[idx].name = name;
            GLOBAL_GAME_DATA.set(currentGame, newstate);
            return newstate;
        });
    }

    function addScore(idx: number, add: boolean) {
        setCurrentGameData((prev) => {
            if (!prev) return prev;
            let newstate = { ...prev };
            newstate.players[idx] = getNextScore(newstate.players[idx], add);
            GLOBAL_GAME_DATA.set(currentGame, newstate);
            return newstate;
        });
    }

    function updateGameNameAction() {
        if (updateGameName(editingNameValue)) {
            setEditingName(false);
            setEditingNameError(false);
        }
        else {
            setEditingNameError(true);
        }
    }

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <GameDataContainer direction="column" justifyContent="space-between">
                <Settings smallScreen={smallScreen} />
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                    >
                        {i18n?.text.TITLE}
                    </Typography>
                    <Box
                        component="div"
                        onSubmit={() => { }}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl fullWidth>
                            <InputLabel id="game-select-label">{i18n?.text.CUR_GAME}</InputLabel>
                            <Select
                                id="game-select"
                                value={currentGame}
                                label="Current Game"
                                onChange={(ev) => updateCurrentGame(ev.target.value)}
                            >
                                {
                                    gameKeys.map((game) => {
                                        return <MenuItem value={game} key={game}>{game}</MenuItem>
                                    })
                                }
                                <Divider />
                                <MenuItem value={"New Game"} key={"new_game"}>{i18n?.text.NEW_GAME}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {
                        currentGame === "" ?
                            <></> :
                            <>
                                <Divider />
                                <Box display={'flex'}>
                                    {
                                        editingName ?
                                            <Box display={'flex'} gap={1} width={'100%'}>
                                                <TextField
                                                    id="game-name"
                                                    label={i18n?.text.GAME_NAME}
                                                    variant="outlined"
                                                    value={editingNameValue}
                                                    onChange={(e) => { setEditingNameValue(e.target.value) }}
                                                    helperText={editingNameError ? i18n?.text.NAME_IN_USE : i18n?.text.ASSIGN_NAME}
                                                    error={editingNameError}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === "Return") {
                                                            updateGameNameAction();
                                                            e.preventDefault();
                                                        }
                                                        else if (e.key === "Escape") {
                                                            setEditingName(false);
                                                            setEditingNameError(false);
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    fullWidth
                                                >
                                                </TextField>
                                                <Tooltip title={i18n?.text.CANCEL}>
                                                    <IconButton style={{ marginLeft: '1rem' }} aria-label="edit" size={'small'} onClick={() => {
                                                        setEditingName(false);
                                                        setEditingNameError(false);
                                                    }}>
                                                        <Close />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={i18n?.text.CONFIRM}>
                                                    <IconButton aria-label="edit" size={'small'} onClick={updateGameNameAction}>
                                                        <Check />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            :
                                            <Typography variant="h6" component="div">
                                                {currentGame}
                                                <Tooltip title={i18n?.text.EDIT_NAME}>
                                                    <IconButton style={{ marginLeft: '1rem' }} aria-label="edit" size={'small'} onClick={() => {
                                                        setEditingName(true);
                                                        setEditingNameValue(currentGame);
                                                    }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                            </Typography>
                                    }
                                </Box>
                                <PlayerList dense={smallScreen}>
                                    {
                                        currentGameData?.players.map((player: Player, i) => {
                                            return (
                                                <PlayerListItem
                                                    key={i}
                                                    secondaryAction={
                                                        editingPlayerName != i ?
                                                            <Box display={'flex'} gap={smallScreen ? 1 : 3}>
                                                                <Tooltip title={i18n?.text.ADD_LEVEL}>
                                                                    <IconButton size={smallScreen ? 'small' : 'medium'} edge="end" aria-label="add" onClick={() => {
                                                                        addScore(i, true);
                                                                    }}>
                                                                        <Add />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={i18n?.text.SUBTRACT_LEVEL}>
                                                                    <IconButton size={smallScreen ? 'small' : 'medium'} edge="end" aria-label="remove" onClick={() => {
                                                                        addScore(i, false);
                                                                    }}>
                                                                        <Remove />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={i18n?.text.MORE_OPTIONS}>
                                                                    <IconButton size={smallScreen ? 'small' : 'medium'} edge="end" aria-label="moreoptions" onClick={(ev) => {
                                                                        handleOpenPlayerMenu(i, ev);
                                                                    }}>
                                                                        <MoreVert />
                                                                    </IconButton>
                                                                </Tooltip>
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
                                                                        setCurrentGameData((prev) => {
                                                                            if (!prev) return prev;
                                                                            let newstate = { ...prev };
                                                                            newstate.players.splice(i, 1);
                                                                            GLOBAL_GAME_DATA.set(currentGame, newstate);
                                                                            return newstate;
                                                                        });
                                                                        handleClosePlayerMenu();
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
                                                                <Box display={'flex'} gap={1} width={'100%'}>
                                                                    <TextField
                                                                        id="player-name"
                                                                        label={i18n?.text.PLAYER_NAME}
                                                                        variant="outlined"
                                                                        value={editingPlayerNameValue}
                                                                        onChange={(e) => { setEditingPlayerNameValue(e.target.value) }}
                                                                        fullWidth
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === "Enter" || e.key === "Return") {
                                                                                updatePlayerName(i, editingPlayerNameValue);
                                                                                setEditingPlayerName(-1);
                                                                                e.preventDefault();
                                                                            }
                                                                            else if (e.key === "Escape") {
                                                                                setEditingPlayerName(-1);
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                    >
                                                                    </TextField>
                                                                    <Tooltip title={i18n?.text.CANCEL}>
                                                                        <IconButton style={{ marginLeft: '1rem' }} aria-label="edit" size={'small'} onClick={() => {
                                                                            setEditingPlayerName(-1);
                                                                        }}>
                                                                            <Close />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title={i18n?.text.CONFIRM}>
                                                                        <IconButton aria-label="edit" size={'small'} onClick={() => {
                                                                            updatePlayerName(i, editingPlayerNameValue);
                                                                            setEditingPlayerName(-1);
                                                                        }}>
                                                                            <Check />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                                :
                                                                <Badge className={"leader-badge"} badgeContent={i18n?.text.LEAD} color="secondary" invisible={currentWinner !== i}>
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
                            </>
                    }
                    {smallScreen ? <></> : <Divider />}
                    <BottomBox display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                        <Box display={'flex'} flexDirection={'row'} gap={2}>
                            <Button variant="outlined" aria-label="add-player" startIcon={<AddBox />} style={currentGame === "" ? { display: 'none' } : {}} onClick={() => {
                                setCurrentGameData((prev) => {
                                    if (!prev) return prev;
                                    let newstate = { ...prev };
                                    newstate.players.push(createPlayer());
                                    GLOBAL_GAME_DATA.set(currentGame, newstate);
                                    return newstate;
                                });
                            }}>
                                {i18n?.text.ADD_PLAYER}
                            </Button >
                            <Button variant="outlined" aria-label="add-player" startIcon={<Delete />} style={currentGame === "" ? { display: 'none' } : {}} onClick={() => {
                                setGameKeys((prev) => prev.filter((key) => key !== currentGame));
                                setCurrentGameData(undefined);
                                GLOBAL_GAME_DATA.delete(currentGame);
                                setCurrentGame("");
                                initScoreboard();
                            }}>
                                {i18n?.text.DELETE_GAME}
                            </Button >
                        </Box>
                        <Box display={'flex'} flexDirection={'row'} gap={2}>
                            <Tooltip title={i18n?.text.IMPORT}>
                                <IconButton aria-label="import" tabIndex={-1} role={undefined} component={'label'}>
                                    <FileUpload />
                                    <VisuallyHiddenInput
                                        type="file"
                                        id='upload_data_input'
                                        accept='application/json'
                                        onChange={(event) => {
                                            if (!event.target.files) return;
                                            if (event.target.files?.length > 0) {
                                                let file = event.target.files[0];
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    let contents = e.target?.result;
                                                    try {
                                                        let data = JSON.parse(contents as string);
                                                        GLOBAL_GAME_DATA.import(data);
                                                        initScoreboard();
                                                    }
                                                    catch {
                                                        setOpenLoadError(true);
                                                    }
                                                }
                                                reader.readAsText(file);
                                            }
                                            // clear file input
                                            // @ts-ignore
                                            document.getElementById('upload_data_input')!.value = null;
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={i18n?.text.EXPORT}>
                                <IconButton aria-label="export" style={currentGame === "" ? { display: 'none' } : {}} onClick={() => {
                                    GLOBAL_GAME_DATA.export();
                                }}>
                                    <FileDownload />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </BottomBox>
                </Card>
                <Dialog
                    open={openLoadError}
                    onClose={() => { }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {i18n?.text.ERROR}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {i18n?.text.IMPORT_ERROR}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenLoadError(false);
                        }} autoFocus>
                            {i18n?.text.OK}
                        </Button>
                    </DialogActions>
                </Dialog>
            </GameDataContainer>
        </AppTheme>
    );
}
