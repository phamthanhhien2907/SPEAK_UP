import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { ProgressTracking } from "@/types/progress-tracking";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<ProgressTracking>[] => [
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
    header: "User Email",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("userId.email")}</div>
    ),
  },
  {
    accessorKey: "completedLessons",
    header: "Completed Lesson",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("completedLessons")}</div>
    ),
  },
  {
    accessorKey: "totalScore",
    header: "Total Score",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("totalScore")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const progressTracking = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editProgressTracking", { progressTracking })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() =>
              onOpen("deleteProgressTracking", { progressTracking })
            }
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
