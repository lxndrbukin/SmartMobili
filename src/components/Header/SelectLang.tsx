import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type RootState,
  type AppDispatch,
  type Language,
  setLanguage,
} from "../../store";

export default function SelectLang({ lang }: { lang: string }): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const current = useSelector((state: RootState) => state.language.current);

  const renderLangs = (): Array<JSX.Element> => {
    return ["en", "ro", "ru"].map((language) => {
      return (
        <option key={language} value={language} selected={lang == language}>
          {language.toUpperCase()}
        </option>
      );
    });
  };

  return (
    <select
      onChange={(e) => dispatch(setLanguage(e.target.value as Language))}
      className="header_lang-selector"
    >
      {renderLangs()}
    </select>
  );
}
