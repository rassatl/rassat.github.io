import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import fr from 'i18n-iso-countries/langs/fr.json';

countries.registerLocale(en);
countries.registerLocale(fr);

export function getCountryList(lang = 'fr') {
  return countries.getNames(lang, { select: 'official' });
}
