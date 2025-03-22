import * as React from 'react';
import LanguageSelect, { LanguageContext } from "../theme/LanguageSelect";
import ColorModeSelect from "../theme/ColorModeSelect";
import { Box, Modal, Tooltip, IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function Settings(props: { smallScreen: boolean }) {
    const i18n = React.useContext(LanguageContext);
    const [openModal, setOpenModal] = React.useState(false);
    return (
        props.smallScreen ?
            <>
                <Tooltip title={i18n?.text.CANCEL}>
                    <IconButton sx={{ position: 'fixed', top: '1rem', right: '1rem' }} size={'small'} onClick={() => {
                        setOpenModal(true);
                    }}>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <Box sx={style} display={'flex'} flexDirection={'column'} gap={2}>
                        <LanguageSelect />
                        <ColorModeSelect />
                    </Box>
                </Modal>
            </> :
            <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }} display={'flex'} gap={2}>
                <LanguageSelect />
                <ColorModeSelect />
            </Box>
    );
}
