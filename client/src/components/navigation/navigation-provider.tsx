// SelectedPageProvider.tsx
import { ReactNode, useState } from "react";
import { SelectedPageContext } from "@/hooks/use-context";

export const SelectedPageProvider = ({
  children,
  initialPage = "Users",
}: {
  children: ReactNode;
  initialPage?: string;
}) => {
  const [selectedPage, setSelectedPage] = useState(initialPage);
  return (
    <SelectedPageContext.Provider value={{ selectedPage, setSelectedPage }}>
      {children}
    </SelectedPageContext.Provider>
  );
};
