import confirmComponent from "./confirmComponent.view";
import { createConfirmation } from "react-confirm";

export const confirm = createConfirmation(confirmComponent);

export interface ICustomConfirmOptions {
  accept?: string;
  decline?: string;
}

function CustomConfirm(confirmation: string, options: ICustomConfirmOptions = {}) {
  return confirm({ confirmation, options });
}

export default CustomConfirm;
