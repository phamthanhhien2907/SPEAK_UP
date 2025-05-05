import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { History } from "@/types/history";
import { User } from "@/types/user";
import { Excercise } from "@/types/excercise";
import { Lesson } from "@/types/lesson";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<History>[] => [
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
    accessorKey: "userId.email",
    id: "userId.email",
    header: "User Email Title",
    cell: ({ row }) => {
      const user = row.original.userId as User;
      return <div className="capitalize">{user?.email || "N/A"}</div>;
    },
  },
  {
    accessorKey: "lessonId.title",
    id: "lessonId.title",
    header: "Lesson Title",
    cell: ({ row }) => {
      const lesson = row.original.lessonId as Lesson;
      return <div className="capitalize">{lesson?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "exerciseId.prompt",
    id: "exerciseId.prompt",
    header: "Exercise Prompt",
    cell: ({ row }) => {
      const exercise = row.original.exerciseId as Excercise;
      return <div className="capitalize">{exercise?.prompt || "N/A"}</div>;
    },
  },
  {
    accessorKey: "attempts",
    header: "Attempts",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("attempts")}</div>
    ),
  },
  {
    accessorKey: "lastAttemptAt",
    header: "Last Attempt At",
    cell: ({ row }) => {
      const date = row.getValue("lastAttemptAt") as string;
      // const formattedDate = date
      //   ? new Date(date).toLocaleString("vi-VN", {
      //       day: "2-digit",
      //       month: "2-digit",
      //       year: "numeric",
      //       hour: "2-digit",
      //       minute: "2-digit",
      //       second: "2-digit",
      //     })
      //   : "N/A";
      const formattedDate = new Date(date).toISOString().split("T")[0];
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const history = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editHistory", { history })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() => onOpen("deleteHistory", { history })}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
