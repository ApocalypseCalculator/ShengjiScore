import * as React from 'react';

import { Box, FormControl, InputLabel, Select, Divider, MenuItem, Tooltip, IconButton, Typography } from '@mui/material';
import { LanguageContext } from '../theme/LanguageSelect';
import { Edit } from '@mui/icons-material';

import NameEditor from './nameeditor';

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
                            useHelperText={true}
                            editFieldId='game-name-edit-small'
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
                                        useHelperText={true}
                                        editFieldId='game-name-edit-large'
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
