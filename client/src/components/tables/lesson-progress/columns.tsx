import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { LessonProgress } from "@/types/lesson-progress";
import { Lesson } from "@/types/lesson";
import { User } from "@/types/user";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<LessonProgress>[] => [
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
    accessorKey: "lessonId",
    header: "Lesson Id Title",
    cell: ({ row }) => {
      const lesson = row.original.lessonId as Lesson; // Access courseId from the row's original data
      return <div className="capitalize">{lesson?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "userId.email",
    id: "userId.email",
    header: "UserId Email Title",
    cell: ({ row }) => {
      const user = row.original.userId as User;
      return <div className="capitalize">{user?.email || "N/A"}</div>;
    },
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("score")}</div>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const lessonProgress = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editLessonProgress", { lessonProgress })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() => onOpen("deleteLessonProgress", { lessonProgress })}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
