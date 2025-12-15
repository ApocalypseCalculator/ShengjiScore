import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';

import { LanguageContext } from './LanguageSelect';

export default function ColorModeSelect(props: SelectProps) {
  const i18n = React.useContext(LanguageContext);
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Select
      value={mode}
      onChange={(event) =>
        setMode(event.target.value as 'system' | 'light' | 'dark')
      }
      SelectDisplayProps={{
        // @ts-ignore
        'data-screenshot': 'toggle-mode',
      }}
      {...props}
    >
      <MenuItem value="system">{i18n?.text.SYSTEM}</MenuItem>
      <MenuItem value="light">{i18n?.text.LIGHT}</MenuItem>
      <MenuItem value="dark">{i18n?.text.DARK}</MenuItem>
    </Select>
  );
}
