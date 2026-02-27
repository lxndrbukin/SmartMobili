import { type JSX } from "react";
import { type BannerProps } from "./types";

export default function CarouselBanner({
  img,
  primaryText,
  secondaryText,
}: BannerProps): JSX.Element {
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
              Order
            </a>
            <a className="button button-transparent" href="/catalog">
              Catalog <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
