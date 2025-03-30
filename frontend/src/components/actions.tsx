import * as React from 'react';

import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AddBox, Delete, MoreHoriz, History } from '@mui/icons-material';
import { LanguageContext } from '../theme/LanguageSelect';

export default function ActionsMenu(props: {
    smallScreen: boolean,
    showMenu: boolean,
    onAdd: () => void,
    onDelete: () => void,
    editingScores: boolean,
    setOpenHistoryModal: (value: boolean) => void,
}) {
    const i18n = React.useContext(LanguageContext);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openActionsMenu, setOpenActionsMenu] = React.useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
    const handleOpenActionsMenu = (event: React.MouseEvent<HTMLLabelElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenActionsMenu(true);
    };
    const handleCloseActionsMenu = () => {
        setAnchorEl(null);
        setOpenActionsMenu(false);
    };
    return (
        <>
            {props.smallScreen ?
                <Box data-intro={i18n?.text.INTRO_ACTIONS} data-step='4' display={'flex'} flexDirection={'row'}>
                    <Button disabled={props.editingScores} variant="outlined" aria-label="more-actions" component={'label'} startIcon={<MoreHoriz />} style={!props.showMenu ? { display: 'none' } : {}} onClick={(ev) => {
                        handleOpenActionsMenu(ev);
                    }}>
                        {i18n?.text.ACTIONS}
                    </Button >
                    <Menu
                        id="import-export-menu"
                        anchorEl={anchorEl}
                        open={openActionsMenu}
                        onClose={handleCloseActionsMenu}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem onClick={() => {
                            handleCloseActionsMenu();
                            props.onAdd();
                        }}>
                            <ListItemIcon>
                                <AddBox fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>{i18n?.text.ADD_PLAYER}</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleCloseActionsMenu();
                            props.setOpenHistoryModal(true);
                        }}>
                            <ListItemIcon>
                                <History fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>{i18n?.text.HISTORY}</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {
                            handleCloseActionsMenu();
                            setOpenDeleteConfirm(true);
                        }}>
                            <ListItemIcon>
                                <Delete fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>{i18n?.text.DELETE_GAME}</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box> :
                <Box data-intro={i18n?.text.INTRO_ACTIONS} data-step='4' display={'flex'} flexDirection={'row'} gap={2}>
                    <Button disabled={props.editingScores} variant="outlined" aria-label="add-player" startIcon={<AddBox />} style={!props.showMenu ? { display: 'none' } : {}} onClick={props.onAdd}>
                        {i18n?.text.ADD_PLAYER}
                    </Button >
                    <Button disabled={props.editingScores} variant="outlined" aria-label="show-history" startIcon={<History />} style={!props.showMenu ? { display: 'none' } : {}} onClick={() => {
                        props.setOpenHistoryModal(true);
                    }}>
                        {i18n?.text.HISTORY}
                    </Button >
                    <Button disabled={props.editingScores} variant="outlined" aria-label="delete-game" startIcon={<Delete />} style={!props.showMenu ? { display: 'none' } : {}} onClick={() => {
                        setOpenDeleteConfirm(true);
                    }}>
                        {i18n?.text.DELETE_GAME}
                    </Button >
                </Box>
            }
            <Dialog
                open={openDeleteConfirm}
                onClose={() => {
                    setOpenDeleteConfirm(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {i18n?.text.CONFIRM}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {i18n?.text.CONFIRM_DELETE_GAME}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDeleteConfirm(false);
                    }} autoFocus>
                        {i18n?.text.CANCEL}
                    </Button>
                    <Button onClick={() => {
                        setOpenDeleteConfirm(false);
                        props.onDelete();
                    }} autoFocus>
                        {i18n?.text.OK}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}