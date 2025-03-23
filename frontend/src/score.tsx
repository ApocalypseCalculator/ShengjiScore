import * as React from 'react';
import { Card, GameDataContainer, BottomBox } from './styled';
import AppTheme from './theme/AppTheme';
import { Divider, CssBaseline, Typography, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { GameDataMap, GameData, initGameData, createPlayer, Round } from './data';

import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { getNextScore, getWinningPlayerIdx } from './utils';

import { LanguageContext } from './theme/LanguageSelect';

import Settings from './components/settings';
import ImportExport from './components/importexport';
import ActionsMenu from './components/actions';
import GameSelector from './components/gameselector';
import GamePlayerList from './components/playerlist';
import History from './components/history';

const GLOBAL_GAME_DATA = new GameDataMap();

export default function ScoreCounter(props: { disableCustomTheme?: boolean }) {
    const i18n = React.useContext(LanguageContext);
    const [currentGameData, setCurrentGameData] = React.useState<GameData>();
    const [gameKeys, setGameKeys] = React.useState<string[]>([]);
    const [currentGame, setCurrentGame] = React.useState("");
    const [editingName, setEditingName] = React.useState(false);
    const [editingNameValue, setEditingNameValue] = React.useState("");
    const [editingNameError, setEditingNameError] = React.useState(false);

    const [editingScores, setEditingScores] = React.useState(false);
    const [editedScoreGameData, setEditedScoreGameData] = React.useState<GameData>();
    const [openHistoryModal, setOpenHistoryModal] = React.useState(false);

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
        if (currentGameData && !editingScores) {
            setCurrentWinner(getWinningPlayerIdx(currentGameData.players));
        }
        else if (editedScoreGameData && editingScores) {
            setCurrentWinner(getWinningPlayerIdx(editedScoreGameData.players));
        }
        else {
            setCurrentWinner(-1);
        }
    }, [currentGameData, editingScores, editedScoreGameData]);

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
        setEditedScoreGameData((prev) => {
            if (!prev) return prev;
            let newstate = { ...prev };
            newstate.players[idx] = getNextScore(newstate.players[idx], add);
            return newstate;
        });
    }

    function submitScoreChanges() {
        if (editedScoreGameData) {
            setCurrentGameData((previousGameData) => {
                // find differences between current and edited score
                // we make the guarantee that no changes other than player scores
                // were made to the game data
                if (!previousGameData) { // should not be a possible case
                    return previousGameData;
                }
                let newround: Round = { time: Date.now(), changes: [] };
                previousGameData.players.forEach((player, idx) => {
                    if (player.id !== editedScoreGameData.players[idx].id) {
                        // horror!
                        console.error('Encountered impossible state: player id mismatch');
                    }
                    if (player.score !== editedScoreGameData.players[idx].score || player.round !== editedScoreGameData.players[idx].round) {
                        newround.changes.push(
                            {
                                id: player.id,
                                schange: editedScoreGameData.players[idx].score - player.score,
                                rchange: editedScoreGameData.players[idx].round - player.round
                            }
                        );
                    }
                })
                if (newround.changes.length > 0) {
                    editedScoreGameData.rounds.push(newround);
                }
                else {
                    return previousGameData;
                }
                console.log('Game score update', editedScoreGameData)
                GLOBAL_GAME_DATA.set(currentGame, editedScoreGameData);
                return editedScoreGameData
            });
        }
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
                    <GameSelector
                        smallScreen={smallScreen}
                        currentGame={currentGame}
                        updateCurrentGame={updateCurrentGame}
                        gameKeys={gameKeys}
                        editingName={editingName}
                        setEditingNameValue={setEditingNameValue}
                        editingNameValue={editingNameValue}
                        editingNameError={editingNameError}
                        handleEditNamePress={() => {
                            setEditingName(true);
                            setEditingNameValue(currentGame);
                        }}
                        handleCancelEditPress={() => {
                            setEditingName(false);
                            setEditingNameError(false);
                        }}
                        updateGameNameAction={updateGameNameAction}
                        editingScores={editingScores}
                        toggleEditingScores={() => {
                            setEditingScores((prev) => {
                                if (!prev) {
                                    // create deep copy of object
                                    setEditedScoreGameData(window.structuredClone(currentGameData))
                                }
                                else {
                                    submitScoreChanges()
                                }
                                return !prev
                            });
                        }}
                    />
                    <GamePlayerList
                        smallScreen={smallScreen}
                        showList={currentGame !== ""}
                        currentGameData={editingScores ? editedScoreGameData : currentGameData}
                        currentWinner={currentWinner}
                        updatePlayerName={updatePlayerName}
                        addScore={addScore}
                        deletePlayer={(idx) => {
                            setCurrentGameData((prev) => {
                                if (!prev) return prev;
                                let newstate = { ...prev };
                                newstate.players.splice(idx, 1);
                                GLOBAL_GAME_DATA.set(currentGame, newstate);
                                return newstate;
                            });
                        }}
                        editingScores={editingScores}
                    />
                    {smallScreen ? <></> : <Divider />}
                    <BottomBox display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                        <ActionsMenu
                            smallScreen={smallScreen}
                            showMenu={currentGame !== ""}
                            onAdd={() => {
                                setCurrentGameData((prev) => {
                                    if (!prev) return prev;
                                    let newstate = { ...prev };
                                    newstate.players.push(createPlayer());
                                    GLOBAL_GAME_DATA.set(currentGame, newstate);
                                    return newstate;
                                });
                            }}
                            onDelete={() => {
                                setGameKeys((prev) => prev.filter((key) => key !== currentGame));
                                setCurrentGameData(undefined);
                                GLOBAL_GAME_DATA.delete(currentGame);
                                setCurrentGame("");
                                initScoreboard();
                            }}
                            editingScores={editingScores}
                            setOpenHistoryModal={setOpenHistoryModal}
                        />
                        <ImportExport editingScores={editingScores} smallScreen={smallScreen} onFileChange={(event) => {
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
                        }} onFileExport={() => {
                            GLOBAL_GAME_DATA.export();
                        }} showExport={currentGame !== ""} />
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
                <History openHistoryModal={openHistoryModal}
                    setOpenHistoryModal={setOpenHistoryModal}
                    gameData={currentGameData} />
            </GameDataContainer>
        </AppTheme>
    );
}
