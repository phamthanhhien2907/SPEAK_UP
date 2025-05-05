import { createContext, useContext } from "react";
export type SelectedPageProps = {
  selectedPage: string;
  setSelectedPage: (c: string) => void;
};
export const SelectedPageContext = createContext<SelectedPageProps | undefined>(
  undefined
);

export const useSelectedPageContext = () => {
  const context = useContext(SelectedPageContext);
  if (!context) {
    throw new Error(
      "useSelectedPageContext must be used within a SelectedPageProvider"
    );
  }
  return context;
};
