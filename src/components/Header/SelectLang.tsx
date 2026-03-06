import type { JSX, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  type RootState,
  type AppDispatch,
  type Language,
  setLanguage,
} from "../../store";

export default function SelectLang(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { currentLang } = useSelector((state: RootState) => state.system);

  const { lang } = useParams();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${lang}`, `/${newLang}`);
    dispatch(setLanguage(e.target.value as Language));
    navigate(newPath);
  };

  const renderLangs = (): Array<JSX.Element> => {
    return ["en", "ro", "ru"].map((langCode) => {
      return (
        <option key={langCode} value={langCode} selected={lang == langCode}>
          {langCode.toUpperCase()}
        </option>
      );
    });
  };

  return (
    <select
      value={currentLang}
      onChange={handleChange}
      className="header_lang-selector"
    >
      {renderLangs()}
    </select>
  );
}
