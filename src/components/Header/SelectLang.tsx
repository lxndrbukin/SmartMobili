import { type JSX } from "react";

export default function SelectLang({ lang }: { lang: string }): JSX.Element {
  const renderLangs = (): Array<JSX.Element> => {
    return ["en", "ro", "ru"].map((language) => {
      return (
        <option value={language} selected={lang == language}>
          {language.toUpperCase()}
        </option>
      );
    });
  };

  return <select className="header_lang-selector">{renderLangs()}</select>;
}
