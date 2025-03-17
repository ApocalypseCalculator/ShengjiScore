import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';

import i18ntext from '../i18n.json';

const ALLOWED_LANGUAGES = {
    en: 'English (Canada)',
    zh: '中文 (简体)',
}

const LOCAL_LANG_KEY = 'lang';

export const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

type LanguageContextType = {
    language: string;
    setLanguage: (language: string) => void;
    text: any;
};

type LanguageProviderProps = {
    children: React.ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [language, setLanguage] = React.useState<string>('en'); // Default language is 'en'
    const [localizedText, setLocalizedText] = React.useState<any>({});

    React.useEffect(() => {
        let lang = window.localStorage.getItem(LOCAL_LANG_KEY)
        if (lang && lang in ALLOWED_LANGUAGES) {
            setLanguage(lang);
        }
    }, []);

    React.useEffect(() => {
        // console.log('Language changed to:', language);
        let localtxt : any = {};
        Object.entries(i18ntext).map(([key, value]) => {
            localtxt[key] = value[language as keyof Object];
        });
        setLocalizedText(localtxt);
        window.localStorage.setItem(LOCAL_LANG_KEY, language);
        document.documentElement.lang = language;
        document.title = localtxt.TITLE;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, text: localizedText }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default function LanguageSelect(props: SelectProps) {
    const languageContext = React.useContext(LanguageContext);
    return (
        <Select
            value={languageContext?.language}
            onChange={(event) => {
                languageContext?.setLanguage(event.target.value as string);
            }}
            {...props}
        >
            {
                Object.entries(ALLOWED_LANGUAGES).map(([key, value]) => {
                    return <MenuItem key={key} value={key}>{value}</MenuItem>
                })}
        </Select>
    );
}
