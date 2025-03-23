import * as React from 'react';

import { Box, FormControl, InputLabel, Select, Divider, MenuItem, Tooltip, IconButton, Typography } from '@mui/material';
import { LanguageContext } from '../theme/LanguageSelect';
import { Edit, Lock, LockOpen } from '@mui/icons-material';

import { AbsoluteButton } from '../styled';

import NameEditor from './nameeditor';

function EditScoresToggle(props: {
    editingScores: boolean,
    toggleEditingScores: () => void,
}) {
    const i18n = React.useContext(LanguageContext);
    return <AbsoluteButton variant={props.editingScores ? "contained" : "outlined"} color="secondary" aria-label="edit-scores" startIcon={props.editingScores ? <LockOpen /> : <Lock />} onClick={props.toggleEditingScores}>
        {props.editingScores ? i18n?.text.FINISH_EDIT_SCORES : i18n?.text.EDIT_SCORES}
    </AbsoluteButton >
}

export default function GameSelector(props: {
    smallScreen: boolean,
    currentGame: string,
    updateCurrentGame: (game: string) => void,
    gameKeys: string[],
    editingName: boolean,
    setEditingNameValue: (value: string) => void,
    editingNameValue: string,
    editingNameError: boolean,
    handleEditNamePress: () => void,
    handleCancelEditPress: () => void,
    updateGameNameAction: () => void,
    editingScores: boolean,
    toggleEditingScores: () => void,
}) {
    const i18n = React.useContext(LanguageContext);
    return (
        <>
            <Box
                component="div"
                onSubmit={() => { }}
                sx={{
                    display: 'flex',
                    flexDirection: props.smallScreen ? 'row' : 'column',
                    width: '100%',
                }}
            >
                {
                    props.editingName && props.smallScreen ?
                        <NameEditor
                            editingNameValue={props.editingNameValue}
                            setEditingNameValue={props.setEditingNameValue}
                            editingNameError={props.editingNameError}
                            handleCancelEditPress={props.handleCancelEditPress}
                            updateNameAction={props.updateGameNameAction}
                            useHelperText={true}
                            editFieldId='game-name-edit-small'
                            label={i18n?.text.GAME_NAME}
                        />
                        :
                        <>
                            <FormControl fullWidth>
                                <InputLabel id="game-select-label">{i18n?.text.CUR_GAME}</InputLabel>
                                <Select
                                    id="game-select"
                                    value={props.currentGame}
                                    label="Current Game"
                                    disabled={props.editingScores}
                                    onChange={(ev) => props.updateCurrentGame(ev.target.value)}
                                >
                                    {
                                        props.gameKeys.map((game) => {
                                            return <MenuItem value={game} key={game}>{game}</MenuItem>
                                        })
                                    }
                                    <Divider />
                                    <MenuItem value={"New Game"} key={"new_game"}>{i18n?.text.NEW_GAME}</MenuItem>
                                </Select>
                            </FormControl>
                            <Tooltip sx={{ display: (props.smallScreen && props.currentGame !== "") ? null : 'none' }} title={i18n?.text.EDIT_NAME}>
                                <IconButton disabled={props.editingScores} style={{ marginLeft: '1rem' }} aria-label="edit" size={'small'} onClick={props.handleEditNamePress}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </>
                }
            </Box>
            {
                props.currentGame === "" ? <></> : (props.smallScreen ? <EditScoresToggle editingScores={props.editingScores} toggleEditingScores={props.toggleEditingScores} /> :
                    <>
                        <Divider />
                        <Box display={'flex'}>
                            {
                                props.editingName ?
                                    <NameEditor
                                        editingNameValue={props.editingNameValue}
                                        setEditingNameValue={props.setEditingNameValue}
                                        editingNameError={props.editingNameError}
                                        handleCancelEditPress={props.handleCancelEditPress}
                                        updateNameAction={props.updateGameNameAction}
                                        useHelperText={true}
                                        editFieldId='game-name-edit-large'
                                        label={i18n?.text.GAME_NAME}
                                    />
                                    :
                                    <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        {props.currentGame}
                                        <Tooltip title={i18n?.text.EDIT_NAME}>
                                            <IconButton disabled={props.editingScores} style={{ marginLeft: '1rem', marginRight: '1rem' }} aria-label="edit" size={'small'} onClick={props.handleEditNamePress}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <EditScoresToggle editingScores={props.editingScores} toggleEditingScores={props.toggleEditingScores} />
                                    </Typography>
                            }
                        </Box>
                    </>)
            }
        </>
    );
}
