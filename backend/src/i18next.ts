import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "./constants";
import fs from "fs";

const I18N_KEY = fs.readFileSync(process.env.I18N_NEXUS_API_KEY, "utf8").trim();
const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${I18N_KEY}`;

i18next
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",

    ns: ["default"],
    defaultNS: "default",

    supportedLngs: SUPPORTED_LANGUAGES.map((x) => x.langCode),
    backend: {
      loadPath: loadPath,
    },
  });

export default i18next;
