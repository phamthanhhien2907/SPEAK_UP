import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useState, useEffect, JSX } from "react";
import NavigationLink from "./navigation-link";
// import ProjectLink from "./project-link";
import ProjectNavigation from "./project-navigation";
import { useSelectedPageContext } from "@/hooks/use-context";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "@/hooks/use-dispatch";
import { logout } from "@/stores/actions/authAction";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepOrange } from "@mui/material/colors";
const containerVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};

const svgVariants = {
  open: {
    rotate: 360,
  },
  close: {
    rotate: 180,
  },
};
type ItemType = {
  id: number;
  name: string;
  icon: JSX.Element;
};

const NavigationBar = ({ items }: { items: ItemType[] }) => {
  const { current } = useSelector((state: RootState) => state.auth);
  const { userData } = useSelector((state: RootState) => state.user);
  const { selectedPage, setSelectedPage } = useSelectedPageContext();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      containerControls.start("open");
      svgControls.start("open");
    } else {
      containerControls.start("close");
      svgControls.start("close");
    }
  }, [isOpen, containerControls, svgControls]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
    setSelectedProject(null);
  };
  const handleSelect = (name: string) => {
    setSelectedPage(name);
  };
  return (
    <>
      <motion.nav
        variants={containerVariants}
        animate={containerControls}
        initial="close"
        className="dark:bg-gray-800 flex w-full flex-col justify-between z-10 p-5 shadow-2xl h-full"
      >
        {/* Top: Logo + Navigation */}
        <div className="flex flex-col gap-12">
          <div className="flex flex-row w-full justify-between place-items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-700 rounded-full" />
            <button
              className="p-1 rounded-full flex"
              onClick={() => handleOpenClose()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8 stroke-gray-800/70"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={svgVariants}
                  animate={svgControls}
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {items?.map((item) => (
              <button key={item.id} onClick={() => handleSelect(item?.name)}>
                <NavigationLink
                  key={item.id}
                  name={item.name}
                  selectedItem={selectedPage}
                >
                  {item.icon}
                </NavigationLink>
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center justify-start px-2 py-4 gap-2 font-normal cursor-pointer stroke-[0.75] place-items-center hover:bg-gray-300/80 shadow-2xl bg-[#e6e2e2] rounded hover:stroke-neutral-100 stroke-neutral-400 transition-colors duration-100">
          <Stack direction="row" spacing={2}>
            <Avatar
              className="stroke-gray-800/70 stroke-[1] min-w-8 w-8"
              sx={{ bgcolor: deepOrange[500], width: 35, height: 35 }}
            >
              N
            </Avatar>
          </Stack>
          <div className="flex flex-col items-start justify-center text-[11px] font-poppins overflow-clip truncate whitespace-nowrap tracking-wide font-medium">
            <p className="text-[10px] truncate font-medium">
              {userData?.firstname && userData?.lastname
                ? userData?.firstname + " " + userData?.lastname
                : "anonymous"}
            </p>
            <p className="text-[10px] truncate font-medium">
              {userData?.email}
            </p>
          </div>
        </button>
      </motion.nav>

      <AnimatePresence>
        {selectedProject && (
          <ProjectNavigation
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            isOpen={isOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;
