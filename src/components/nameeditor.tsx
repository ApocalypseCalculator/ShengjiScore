import * as React from 'react';

import { Box, TextField, Tooltip, IconButton } from '@mui/material';
import { LanguageContext } from '../theme/LanguageSelect';
import { Close, Check } from '@mui/icons-material';

export default function NameEditor(props: {
    editingNameValue: string,
    setEditingNameValue: (value: string) => void,
    editingNameError: boolean,
    handleCancelEditPress: () => void,
    updateNameAction: () => void,
    useHelperText: boolean
    editFieldId?: string
    label: string
}) {
    const i18n = React.useContext(LanguageContext);
    return (
        <Box display={'flex'} gap={1} width={'100%'}>
            <TextField
                id={props.editFieldId ? props.editFieldId : "name-edit"}
                label={props.label}
                variant="outlined"
                value={props.editingNameValue}
                autoFocus={true}
                onChange={(e) => { props.setEditingNameValue(e.target.value) }}
                helperText={props.useHelperText ? (props.editingNameError ? i18n?.text.NAME_IN_USE : i18n?.text.ASSIGN_NAME) : null}
                error={props.editingNameError && props.useHelperText}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Return") {
                        props.updateNameAction();
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
                <IconButton aria-label="edit" size={'small'} onClick={props.updateNameAction}>
                    <Check />
                </IconButton>
            </Tooltip>
        </Box>)
}