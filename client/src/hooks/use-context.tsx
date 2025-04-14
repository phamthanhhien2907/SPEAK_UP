import { createContext, useContext } from "react";
export type selectedPageProps = {
  selectedPage: string;
  setSelectedPage: (c: string) => void;
};
export const SelectedPageContext = createContext<selectedPageProps>({
  selectedPage: "Users",
  setSelectedPage: () => {},
});
export const useSelectedPageContext = () => useContext(SelectedPageContext);
