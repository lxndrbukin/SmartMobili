import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { type BannerProps } from "./types";

export default function CarouselBanner({
  img,
  primaryText,
  secondaryText,
}: BannerProps): JSX.Element {
  const { t } = useTranslation("carousel");

  return (
    <div
      className="top-banner_wrapper"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <div className="top-banner">
        <div className="top-banner_left">
          <span className="top-banner_primary-text">{primaryText}</span>
          <span className="top-banner_secondary-text">{secondaryText}</span>
          <div className="button-container">
            <a className="button" href="/order">
              {t("bannerLinks.order")}
            </a>
            <a className="button button-transparent" href="/catalog">
              {t("bannerLinks.catalog")}
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
