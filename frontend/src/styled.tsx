import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Box, List, ListItem, Button } from '@mui/material';

export const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(0.2),
        gap: theme.spacing(1.5),
    },
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(4),
        gap: theme.spacing(2),
    },
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '800px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export const GameDataContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    [theme.breakpoints.down('md')]: {
        padding: 0,
    },
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const PlayerList = styled(List)(({ theme }) => ({
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
        maxHeight: '78vh', // literally an arbitrary number :clown:
    },
    [theme.breakpoints.up('md')]: {
        maxHeight: '66vh', // literally an arbitrary number :clown:
    },
    paddingLeft: 0,
    paddingRight: 0,
}));

export const PlayerListItem = styled(ListItem)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
}));

export const BottomBox = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(3),
        width: '91%',
    },
}));

export const AbsoluteButton = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('md')]: { // pov: backend dev does CSS
        position: 'absolute',
        bottom: 0,
        left: '40%',
        marginBottom: theme.spacing(3),
        zIndex: 1
    },
    [theme.breakpoints.up('md')]: {
        marginLeft: 'auto',
        minWidth: 'fit-content',
    },
}));
