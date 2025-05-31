import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { ModalData, ModalType } from "@/hooks/use-model-store";
import { Lesson } from "@/types/lesson";
import { Course } from "@/types/course";
import { Topic } from "@/types/topic";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<Lesson>[] => [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase  px-4">{row.getValue("title")}</div>
    ),
  },
  // {
  //   accessorKey: "fullname",
  //   header: () => <div className="">Fullname</div>,
  //   cell: ({ row }) => {
  //     const lesson = row.original as Lesson;

  //     return (
  //       <div className="font-medium">{`${user.lastname} ${user.firstname}`}</div>
  //     );
  //   },
  // },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => (
      <div className="capitalize ">{row.getValue("content")}</div>
    ),
  },
  {
    accessorKey: "courseId", // Add this accessorKey for courseId.title
    header: "Course Title",
    cell: ({ row }) => {
      const course = row.original.courseId as Course; // Access courseId from the row's original data
      return <div className="capitalize">{course?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("level")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "parentLessonId.title",
    id: "parentLessonId.title",
    header: "Parent Lesson Id",
    cell: ({ row }) => {
      const lessonParent = row.original.parentLessonId as Lesson;
      return <div className="capitalize">{lessonParent?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "parentTopicId.title",
    id: "parentTopicId.title",
    header: "Parent Lesson Id",
    cell: ({ row }) => {
      const topic = row.original.parentTopicId as Topic;
      return <div className="capitalize">{topic?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("thumbnail")}</div>
    ),
  },
  {
    accessorKey: "aiImg",
    header: "AI Image",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("aiImg")}</div>
    ),
  },
  {
    accessorKey: "isAIConversationEnabled",
    header: "AI Conversation Enabled",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("isAIConversationEnabled")}
      </div>
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
      const lesson = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editLesson", { lesson })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() => onOpen("deleteLesson", { lesson })}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
