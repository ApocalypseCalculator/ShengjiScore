import * as React from 'react';

import { Box, FormControl, InputLabel, Select, Divider, MenuItem, TextField, Tooltip, IconButton, Typography } from '@mui/material';
import { LanguageContext } from '../theme/LanguageSelect';
import { Close, Check, Edit } from '@mui/icons-material';

function NameEditor(props: {
    editingNameValue: string,
    setEditingNameValue: (value: string) => void,
    editingNameError: boolean,
    handleCancelEditPress: () => void,
    updateGameNameAction: () => void,
}) {
    const i18n = React.useContext(LanguageContext);
    return (
        <Box display={'flex'} gap={1} width={'100%'}>
            <TextField
                id="game-name"
                label={i18n?.text.GAME_NAME}
                variant="outlined"
                value={props.editingNameValue}
                autoFocus={true}
                onChange={(e) => { props.setEditingNameValue(e.target.value) }}
                helperText={props.editingNameError ? i18n?.text.NAME_IN_USE : i18n?.text.ASSIGN_NAME}
                error={props.editingNameError}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Return") {
                        props.updateGameNameAction();
                        e.preventDefault();
                    }
                    else if (e.key === "Escape") {
                        props.handleCancelEditPress();
                        e.preventDefault();
                    }
                }}
                fullWidth
            />
            <Tooltip title={i18n?.text.CANCEL}>
                <IconButton style={{ marginLeft: '1rem' }} aria-label="edit" size={'small'} onClick={props.handleCancelEditPress}>
                    <Close />
                </IconButton>
            </Tooltip>
            <Tooltip title={i18n?.text.CONFIRM}>
                <IconButton aria-label="edit" size={'small'} onClick={props.updateGameNameAction}>
                    <Check />
                </IconButton>
            </Tooltip>
        </Box>)
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
                            updateGameNameAction={props.updateGameNameAction}
                        />
                        :
                        <>
                            <FormControl fullWidth>
                                <InputLabel id="game-select-label">{i18n?.text.CUR_GAME}</InputLabel>
                                <Select
                                    id="game-select"
                                    value={props.currentGame}
                                    label="Current Game"
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
                            <Tooltip sx={{ display: props.smallScreen ? null : 'none' }} title={i18n?.text.EDIT_NAME}>
                                <IconButton style={{ marginLeft: '1rem' }} aria-label="edit" size={'small'} onClick={props.handleEditNamePress}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </>
                }
            </Box>
            {
                props.smallScreen ? null :
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
                                        updateGameNameAction={props.updateGameNameAction}
                                    />
                                    :
                                    <Typography variant="h6" component="div">
                                        {props.currentGame}
                                        <Tooltip title={i18n?.text.EDIT_NAME}>
                                            <IconButton style={{ marginLeft: '1rem' }} aria-label="edit" size={'small'} onClick={props.handleEditNamePress}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                            }
                        </Box>
                    </>
            }
        </>
    );
}
