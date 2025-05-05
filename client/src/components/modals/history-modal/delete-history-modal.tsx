"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import { apiDeleteHistoryById } from "@/services/history.services";

export const DeleteHistoryModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { history } = data;
  const isModalOpen = isOpen && type === "deleteHistory";
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    console.log(history?._id);
    if (!history?._id) return;
    setIsLoading(true);
    try {
      const res = await apiDeleteHistoryById(history._id);
      if (res) onClose();
    } catch (err) {
      console.error("Failed to delete course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete History
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 flex items-center justify-center gap-2 mb-4">
          <CircleAlert color="red" size={25} />
          <span className="font-medium">
            Are you sure you want to delete this course?
          </span>
        </div>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <Button
            onClick={handleClose}
            className="text-black rounded-[4px]"
            disabled={isLoading}
          >
            No, cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            Yes, I'm sure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
