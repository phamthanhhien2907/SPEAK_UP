"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";

import { useNavigate, useParams } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { Form } from "@/components/ui/form";
const formSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password is required",
  }),
});
export const DeleteFeedBackModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useNavigate();
  const params = useParams();
  const isModalOpen = isOpen && type === "deleteFeedBack";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {};
  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete FeedBack
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-6 flex items-center justify-center gap-2">
              <CircleAlert color="red" size={25} />
              <span className="font-medium">
                Are you sure you want to delete this user ?
              </span>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                onClick={() => onClose()}
                className="text-black rounded-[4px]"
              >
                No, cancel
              </Button>
              <Button
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
              >
                Yes, I'm sure
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
