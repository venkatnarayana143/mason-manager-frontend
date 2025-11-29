import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'te' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            title={t('language')}
        >
            <Globe size={20} />
            <span className="font-medium">
                {i18n.language === 'en' ? 'తెలుగు' : 'English'}
            </span>
        </button>
    );
};

export default LanguageSwitcher;
