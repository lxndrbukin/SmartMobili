import { useParams } from "react-router-dom";

const useLocalePath = () => {
  const { lang } = useParams();
  return (path: string) => `/${lang}${path}`;
};

export default useLocalePath;
