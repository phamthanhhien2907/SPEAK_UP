import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { Enrollment } from "@/types/enrollment";
import { Course } from "@/types/course";
import { User } from "@/types/user";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<Enrollment>[] => [
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
    accessorKey: "courseId", // Add this accessorKey for courseId.title
    header: "Course Id Title",
    cell: ({ row }) => {
      const course = row.original.courseId as Course;
      return <div className="capitalize">{course?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "userId.email",
    id: "userId.email",
    header: "User Email",
    cell: ({ row }) => {
      const usser = row.original.userId as User;
      return <div className="capitalize">{usser?.email || "N/A"}</div>;
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("progress")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const enrollment = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editEnrollment", { enrollment })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() => onOpen("deleteEnrollment", { enrollment })}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
