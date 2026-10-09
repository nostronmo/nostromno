import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { errorDict } from './error-dict';
import { uiDict } from './ui-dict';

export type Lang = 'pt_br' | 'en' | 'ru';

export const LocaleStore = signalStore(
  { providedIn: 'root' },
  withState({ lang: getInitialLang() }),
  withComputed(({ lang }) => ({
    ui: computed(() => uiDict[lang()]),
    error: computed(() => errorDict[lang()]),
  })),
  withMethods((store) => ({
    setLang(lang: Lang) {
      localStorage.setItem('lang', lang);
      patchState(store, { lang });
    },
    cycleLanguage() {
      const current = store.lang();
      let nextLang: Lang = 'en';
      if (current === 'pt_br') {
        nextLang = 'en';
      } else if (current === 'en') {
        nextLang = 'ru';
      } else {
        nextLang = 'pt_br';
      }
      localStorage.setItem('lang', nextLang);
      patchState(store, { lang: nextLang });
    },
    getDisplayLabel(): string {
      const current = store.lang();
      if (current === 'pt_br') {
        return 'ENGLISH';
      }
      if (current === 'en') {
        return 'РУССКИЙ';
      }
      /*
      if (current === 'ru') {
        return 'РУССКИЙ';
      }
      */
      return 'PORTUGUÊS';
    },
  })),
);

export function getInitialLang(): Lang {
  const saved = localStorage.getItem('lang') as Lang;
  if (saved) {
    return saved;
  }

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('pt_br')) {
    return 'pt_br';
  }
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  if (browserLang.startsWith('ru')) {
    return 'ru';
  }
  return 'en';
}
