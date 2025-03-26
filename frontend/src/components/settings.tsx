import * as React from 'react';
import LanguageSelect, { LanguageContext } from "../theme/LanguageSelect";
import ColorModeSelect from "../theme/ColorModeSelect";
import { Box, Modal, Tooltip, IconButton, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Settings as SettingsIcon, Help, GitHub, ArrowDropDown } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function AboutSection() {
    const i18n = React.useContext(LanguageContext);
    return (
        <>
            <Typography
                component="h2"
                variant="h6"
            >
                {i18n?.text.HELP}
            </Typography>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ArrowDropDown />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography component="span">{i18n?.text.HOW_TO_PLAY_SUMMARY}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Typography
                component="p"
                variant="body1"
            >
                {i18n?.text.MADE_BY}
            </Typography>
            <Button variant="outlined" aria-label="about" startIcon={<GitHub />} target={'_blank'} rel={'noopener noreferrer'} href={'https://github.com/ApocalypseCalculator/ShengjiScore'} component={'a'}>
                {i18n?.text.SOURCE_CODE}
            </Button >
        </>
    )
}

function AboutSectionButton() {
    const i18n = React.useContext(LanguageContext);
    const [openHelpModal, setOpenHelpModal] = React.useState(false);
    return (
        <>
            <Button variant="outlined" aria-label="about" startIcon={<Help />} onClick={() => {
                setOpenHelpModal(true);
            }}>
                {i18n?.text.HELP}
            </Button >
            <Modal open={openHelpModal} onClose={() => setOpenHelpModal(false)}>
                <Box sx={{ ...style, width: 750, alignItems: 'center' }} display={'flex'} flexDirection={'column'} gap={2}>
                    <AboutSection />
                </Box>
            </Modal>
        </>
    )
}


export default function Settings(props: { smallScreen: boolean }) {
    const i18n = React.useContext(LanguageContext);
    const [openModal, setOpenModal] = React.useState(false);
    return (
        props.smallScreen ?
            <>
                <Tooltip title={i18n?.text.SETTINGS}>
                    <IconButton sx={{ position: 'fixed', top: '1rem', right: '1rem' }} size={'small'} onClick={() => {
                        setOpenModal(true);
                    }}>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <Box sx={{ ...style, width: 400 }} display={'flex'} flexDirection={'column'} gap={2}>
                        <Typography
                            component="h2"
                            variant="h6"
                        >
                            {i18n?.text.SETTINGS}
                        </Typography>
                        <LanguageSelect />
                        <ColorModeSelect />
                        <AboutSection />
                    </Box>
                </Modal>
            </> :
            <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }} display={'flex'} gap={2}>
                <AboutSectionButton />
                <LanguageSelect />
                <ColorModeSelect />
            </Box>
    );
}
