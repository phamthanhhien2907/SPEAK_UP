interface Props {
  children: React.ReactNode;
  name: string;
  selectedItem?: string | null;
  setSelectedItem?: (val: string | null) => void;
}

const NavigationLink = ({
  children,
  name,
  setSelectedItem,
  selectedItem,
}: Props) => {
  const handleClick = () => {
    if (setSelectedItem) {
      setSelectedItem(name);
    }
  };
  return (
    <a
      href="#"
      onClick={handleClick}
      className={`${
        selectedItem === name
          ? "flex p-1 rounded cursor-pointer stroke-[0.75] stroke-neutral-400  place-items-center gap-3 bg-gray-300/50 transition-colors duration-100"
          : "flex p-1 rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 place-items-center gap-3 hover:bg-gray-300/50 transition-colors duration-100"
      }`}
    >
      {children}
      <p className="text-inherit font-poppins overflow-clip truncate whitespace-nowrap tracking-wide">
        {name}
      </p>
    </a>
  );
};

export default NavigationLink;
