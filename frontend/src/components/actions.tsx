import * as React from 'react';

import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { AddBox, Delete, MoreHoriz } from '@mui/icons-material';
import { LanguageContext } from '../theme/LanguageSelect';

export default function ActionsMenu(props: {
    smallScreen: boolean,
    showMenu: boolean,
    onAdd: () => void,
    onDelete: () => void,
}) {
    const i18n = React.useContext(LanguageContext);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openActionsMenu, setOpenActionsMenu] = React.useState(false);
    const handleOpenActionsMenu = (event: React.MouseEvent<HTMLLabelElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenActionsMenu(true);
    };
    const handleCloseActionsMenu = () => {
        setAnchorEl(null);
        setOpenActionsMenu(false);
    };
    return (
        props.smallScreen ?
            <Box display={'flex'} flexDirection={'row'}>
                <Button variant="outlined" aria-label="more-actions" component={'label'} startIcon={<MoreHoriz />} style={!props.showMenu ? { display: 'none' } : {}} onClick={(ev) => {
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
                    <Divider />
                    <MenuItem onClick={() => {
                        handleCloseActionsMenu();
                        props.onDelete();
                    }}>
                        <ListItemIcon>
                            <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{i18n?.text.DELETE_GAME}</ListItemText>
                    </MenuItem>
                </Menu>
            </Box> :
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Button variant="outlined" aria-label="add-player" startIcon={<AddBox />} style={!props.showMenu ? { display: 'none' } : {}} onClick={props.onAdd}>
                    {i18n?.text.ADD_PLAYER}
                </Button >
                <Button variant="outlined" aria-label="add-player" startIcon={<Delete />} style={!props.showMenu ? { display: 'none' } : {}} onClick={props.onDelete}>
                    {i18n?.text.DELETE_GAME}
                </Button >
            </Box>
    );
}