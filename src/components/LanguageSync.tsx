import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLanguage } from "../store/slices/systemSlice";

const SUPPORTED_LANGUAGES = ["en", "ru", "ro"];

export default function LanguageSync(): null {
  const { lang } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) {
      navigate("/en", { replace: true });
      return;
    }

    dispatch(setLanguage(lang as "en" | "ru" | "ro"));
  }, [lang]);

  return null;
}
