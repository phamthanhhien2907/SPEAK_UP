import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { ExerciseVocabulary } from "@/types/excercise-vocabulary";
import { Excercise } from "@/types/excercise";
import { Vocabulary } from "@/types/vocabulary";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<ExerciseVocabulary>[] => [
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
    accessorKey: "exerciseId.prompt",
    id: "exerciseId.prompt",
    header: "Exercise Prompt",
    cell: ({ row }) => {
      const exercise = row.original.exerciseId as Excercise;
      return <div className="capitalize">{exercise?.prompt || "N/A"}</div>;
    },
  },
  {
    accessorKey: "vocabularyId.word",
    id: "vocabularyId.word",
    header: "Vocabulary Word",
    cell: ({ row }) => {
      const vocabulary = row.original.vocabularyId as Vocabulary;
      return <div className="capitalize">{vocabulary?.word || "N/A"}</div>;
    },
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const exerciseVocabulary = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              onOpen("editExerciseVocabulary", { exerciseVocabulary })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() =>
              onOpen("deleteExerciseVocabulary", { exerciseVocabulary })
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
