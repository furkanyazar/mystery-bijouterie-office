import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactNode } from "react";

export const notificationItems: INotificationItems = {
  show: false,
  title: "",
  description: "",
  buttons: [],
  closable: true,
};

export interface INotificationItems {
  show: boolean;
  title: string;
  description: ReactNode;
  buttons: IButton[];
  closable: boolean;
}

export interface IButton {
  key: string;
  text: string;
  variant: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | "link";
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  loading: boolean;
  icon?: IconProp;
}

export interface ISetNotification {
  show: boolean;
  title: string;
  description: ReactNode;
  closable: boolean;
  buttons: IButton[];
}
