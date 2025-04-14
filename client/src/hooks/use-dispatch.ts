import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores/reducers/store"; // đường dẫn đến store.ts

export const useAppDispatch = () => useDispatch<AppDispatch>();
