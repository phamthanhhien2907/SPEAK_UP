import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { Vocabulary } from "@/types/vocabulary";
export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void
): ColumnDef<Vocabulary>[] => [
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
    accessorKey: "word",
    header: "Word",
    cell: ({ row }) => <div className="capitalize">{row.getValue("word")}</div>,
  },
  {
    accessorKey: "phonetic",
    header: "Phonetic",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phonetic")}</div>
    ),
  },
  {
    accessorKey: "meaning",
    header: "Meaning",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("meaning")}</div>
    ),
  },
  {
    accessorKey: "exampleSentence",
    header: "Example Sentence",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("exampleSentence")}</div>
    ),
  },
  {
    accessorKey: "audioUrl",
    header: "Audio Url",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("audioUrl")}</div>
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
            onClick={() => onOpen("editVocabulary")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit />
          </Button>
          <Button
            onClick={() => onOpen("deleteVocabulary")}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
