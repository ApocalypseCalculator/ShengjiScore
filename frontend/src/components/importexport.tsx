import * as React from 'react';
import { ImportExport as ImportExportIcon, FileUpload, FileDownload } from '@mui/icons-material';
import { VisuallyHiddenInput } from '../styled';
import { Box, Tooltip, IconButton, Menu, MenuItem } from '@mui/material';
import { LanguageContext } from '../theme/LanguageSelect';

export default function ImportExport(props: {
    smallScreen: boolean;
    onFileChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    onFileExport: () => void;
    showExport: boolean;
    editingScores: boolean;
}) {
    const i18n = React.useContext(LanguageContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openImportExportMenu, setOpenImportExportMenu] = React.useState(false);
    const handleOpenImportExportMenu = (event: React.MouseEvent<HTMLLabelElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenImportExportMenu(true);
    };
    const handleCloseImportExportMenu = () => {
        setAnchorEl(null);
        setOpenImportExportMenu(false);
    };
    return (
        props.smallScreen ?
            <Box display={'flex'} flexDirection={'row'}>
                <Tooltip title={i18n?.text.IMPORT_EXPORT}>
                    <IconButton disabled={props.editingScores} onClick={(ev) => {
                        handleOpenImportExportMenu(ev);
                    }} aria-label="import" tabIndex={-1} role={undefined} component={'label'}>
                        <ImportExportIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="import-export-menu"
                    anchorEl={anchorEl}
                    open={openImportExportMenu}
                    onClose={handleCloseImportExportMenu}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem component={'label'}>{i18n?.text.IMPORT}
                        <VisuallyHiddenInput
                            type="file"
                            id='upload_data_input_small'
                            accept='application/json'
                            onChange={(event) => {
                                props.onFileChange(event);
                                // clear file input
                                // @ts-ignore
                                document.getElementById('upload_data_input_small')!.value = null;
                            }}
                        />
                    </MenuItem>
                    <MenuItem style={!props.showExport ? { display: 'none' } : {}} onClick={props.onFileExport}>{i18n?.text.EXPORT}</MenuItem>
                </Menu>
            </Box> :
            <Box display={'flex'} flexDirection={'row'} gap={2}>
                <Tooltip title={i18n?.text.IMPORT}>
                    <IconButton disabled={props.editingScores} aria-label="import" tabIndex={-1} role={undefined} component={'label'}>
                        <FileUpload />
                        <VisuallyHiddenInput
                            type="file"
                            id='upload_data_input'
                            accept='application/json'
                            onChange={(event) => {
                                props.onFileChange(event);
                                // clear file input
                                // @ts-ignore
                                document.getElementById('upload_data_input')!.value = null;
                            }}
                        />
                    </IconButton>
                </Tooltip>
                <Tooltip title={i18n?.text.EXPORT}>
                    <IconButton disabled={props.editingScores} aria-label="export" style={!props.showExport ? { display: 'none' } : {}} onClick={props.onFileExport}>
                        <FileDownload />
                    </IconButton>
                </Tooltip>
            </Box>
    )
}