import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "./constants";

const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${process.env.I18N_NEXUS_API_KEY}`;

i18next
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",

    ns: ["default"],
    defaultNS: "default",

    supportedLngs: SUPPORTED_LANGUAGES,
    backend: {
      loadPath: loadPath,
    },
  });

export default i18next;
