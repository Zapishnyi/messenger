import { NavigateFunction, NavigateOptions } from "react-router-dom";

let navigate: NavigateFunction;

export const setNavigate = (navFunction: NavigateFunction) => {
  navigate = navFunction;
};

export const navigateTo = (path: string, state?: NavigateOptions) => {
  navigate(path, state);
};
