import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import type { BrandProps } from "./types";

export default function Brands(): JSX.Element {
  const { t } = useTranslation("brands");

  const brands = t("brands", { returnObjects: true }) as Array<BrandProps>;

  const renderBrands = (brands: Array<BrandProps>) => {
    return brands.map((brand) => {
      return (
        <div key={brand.name} className="brand-step">
          <img alt={brand.name} src={brand.img} />
          {/* <span>{brand.name}</span> */}
          {brand.description && <p>{brand.description}</p>}
        </div>
      );
    });
  };

  return (
    <div className="brands-wrapper">
      <div className="brands">
        <h3 className="brands-header">{t("header")}</h3>
        <div className="brands-list">{renderBrands(brands)}</div>
      </div>
    </div>
  );
}
