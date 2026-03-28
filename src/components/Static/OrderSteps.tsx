import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import type { OrderStepProps } from "./types";

export default function OrderSteps(): JSX.Element {
  const { t } = useTranslation("orderSteps");

  const steps = t("steps", { returnObjects: true }) as Array<OrderStepProps>;

  const renderSteps = (steps: Array<OrderStepProps>) => {
    return steps.map((step) => {
      return (
        <div key={step.primaryText} className="order-step">
          <img alt={step.primaryText} src={step.img} />
          <span>{step.primaryText}</span>
          <p>{step.secondaryText}</p>
        </div>
      );
    });
  };

  return (
    <div className="order-steps-wrapper">
      <div className="order-steps">
        <h3 className="order-steps-header">{t("header")}</h3>
        <div className="order-steps-list">{renderSteps(steps)}</div>
      </div>
    </div>
  );
}
