import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { Excercise } from "@/types/excercise";
import { Lesson } from "@/types/lesson";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<Excercise>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "lessonId.title", // Add this accessorKey for courseId.title
    id: "lessonId.title",
    header: "Lesson Title",
    cell: ({ row }) => {
      const lesson = row.original.lessonId as Lesson;
      return <div className="capitalize">{lesson?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("type")}</div>,
  },

  {
    accessorKey: "prompt",
    header: "Prompt",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("prompt")}</div>
    ),
  },
  {
    accessorKey: "difficultyLevel",
    header: "Difficulty Level",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("difficultyLevel")}</div>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editExercise")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() => onOpen("deleteExercise")}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
