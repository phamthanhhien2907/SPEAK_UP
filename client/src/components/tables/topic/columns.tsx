import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { ModalData, ModalType } from "@/hooks/use-model-store";
import { Topic } from "@/types/topic";
import { Course } from "@/types/course";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<Topic>[] => [
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
    accessorKey: "courseId.title",
    id: "courseId.title",
    header: "Course Title",
    cell: ({ row }) => {
      const course = row.original.courseId as Course;
      return <div className="capitalize">{course?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "content",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Content
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase px-4">{row.getValue("content")}</div>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("level")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("section")}</div>
    ),
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("thumbnail")}</div>
    ),
  },
  {
    accessorKey: "totalLessons",
    header: "Total Lesson",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("totalLessons")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const topic = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editTopic", { topic })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() => onOpen("deleteTopic", { topic })}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
