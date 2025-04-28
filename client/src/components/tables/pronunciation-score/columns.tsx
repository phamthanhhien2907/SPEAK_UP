import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { PronunciationScore } from "@/types/pronunciation-score";
import { User } from "@/types/user";
import { Excercise } from "@/types/excercise";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<PronunciationScore>[] => [
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
    cell: ({ row }) => {
      const user = row.original.userId as User; // Access courseId from the row's original data
      return <div className="capitalize">{user?.email || "N/A"}</div>;
    },
  },
  {
    accessorKey: "exerciseId.id",
    id: "exerciseId.id",
    header: "Exercise Course Title",
    cell: ({ row }) => {
      console.log(row.original.exerciseId);
      const exercise = row.original.exerciseId as Excercise;
      return <div className="capitalize">{exercise?.prompt || "N/A"}</div>;
    },
  },
  {
    accessorKey: "phonetic",
    header: "Phonetic",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phonetic")}</div>
    ),
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("score")}</div>
    ),
  },
  {
    accessorKey: "userAudioUrl",
    header: "User Audio Url",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("userAudioUrl")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const pronunciationScore = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              onOpen("editPronunciationScore", { pronunciationScore })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() =>
              onOpen("deletePronunciationScore", { pronunciationScore })
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
