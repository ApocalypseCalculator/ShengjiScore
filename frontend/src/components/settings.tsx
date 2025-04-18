import * as React from 'react';
import LanguageSelect, { LanguageContext } from "../theme/LanguageSelect";
import ColorModeSelect from "../theme/ColorModeSelect";
import { Box, Modal, Tooltip, IconButton, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { Settings as SettingsIcon, Help, GitHub, ArrowDropDown, Info } from '@mui/icons-material';
import introJs from 'intro.js';

import pkg from '../../package.json';

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

function AboutSection(props: {
    setOpenModal: (value: boolean) => void,
}) {
    const i18n = React.useContext(LanguageContext);
    return (
        <>
            <Typography
                component="h2"
                variant="h6"
            >
                {i18n?.text.HELP}
            </Typography>
            <Typography>
                {i18n?.text.ABOUT_THE_APP}
            </Typography>
            <Button variant="outlined" aria-label="about" startIcon={<Info />} onClick={() => {
                props.setOpenModal(false);
                let intro = introJs();
                intro.onafterchange(() => {
                    let btns = document.getElementsByClassName('introjs-nextbutton');
                    for (let i = 0; i < btns.length; i++) {
                        (btns.item(i) as HTMLButtonElement).textContent = i18n?.text.INTRO_NEXT;
                    }
                    let btns2 = document.getElementsByClassName('introjs-prevbutton');
                    for (let i = 0; i < btns2.length; i++) {
                        (btns2.item(i) as HTMLButtonElement).textContent = i18n?.text.INTRO_PREV;
                    }
                });
                intro.start();
            }}>
                {i18n?.text.BEGIN_INTRO}
            </Button >
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
                        {i18n?.text.HOW_TO_PLAY_DETAILS}
                    </Typography>
                    <Box display={'flex'} flexDirection={'row'} width={'100%'} justifyContent={'center'} gap={4} mt={2}>
                        <Typography target={'_blank'} rel={'noopener noreferrer'} component="a" href='https://en.wikipedia.org/wiki/Sheng_ji'>
                            English
                        </Typography>
                        <Typography target={'_blank'} rel={'noopener noreferrer'} component="a" href='https://zh.wikipedia.org/wiki/%E5%8D%87%E7%B4%9A_(%E6%92%B2%E5%85%8B%E7%89%8C)'>
                            中文
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Typography
                component="p"
                variant="body1"
            >
                {i18n?.text.MADE_BY}
            </Typography>
            <Typography
                component="p"
                variant="body1"
            >
                {i18n?.text.VERSION}{pkg.version}
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
                    <AboutSection setOpenModal={setOpenHelpModal} />
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
                    <Box sx={{ ...style, width: 400, alignItems: 'center' }} display={'flex'} flexDirection={'column'} gap={2}>
                        <Typography
                            component="h2"
                            variant="h6"
                        >
                            {i18n?.text.SETTINGS}
                        </Typography>
                        <LanguageSelect />
                        <ColorModeSelect />
                        <Divider/>
                        <AboutSection setOpenModal={setOpenModal} />
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
