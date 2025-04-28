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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { apiGetAllLesson } from "@/services/lesson.services";
import { apiGetAllUser } from "@/services/user.services";
import { LessonProgressScore } from "@/types/lesson-progress";
import { apiCreateLessonProgress } from "@/services/lesson-progress.services";
const formSchema = z.object({
  lessonId: z.string().min(1, {
    message: "Lesson Id is required",
  }),
  userId: z.string().min(6, {
    message: "User Id is required",
  }),
  score: z.number().min(0, {
    message: "Score must be at least 0",
  }),
});
export const CreateLessonProgressModal = () => {
  const [lessonData, setLessonData] = useState([]);
  const [userData, setUserData] = useState([]);
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "createtLessonProgress";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonId: "",
      userId: "",
      score: 0,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const res = await apiCreateLessonProgress({
      ...values,
      lessonId: { _id: values.lessonId },
      userId: { _id: values.userId },
    });
    if (res) {
      onClose();
    }
    form.reset();
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const getAllLesson = async () => {
    const lesson = await apiGetAllLesson();
    if (lesson.data.success) {
      setLessonData(lesson.data.rs);
    } else {
      console.log("Failed to fetch users");
    }
  };
  const getAllUser = async () => {
    const user = await apiGetAllUser();
    if (user.data.success) {
      setUserData(user.data.rs);
    } else {
      console.log("Failed to fetch users");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllLesson(), getAllUser()]);
    };
    fetchData();
  }, []);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Lesson Progress
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="lessonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Course Id
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(lessonData)?.map((type) => (
                          <SelectItem
                            key={type?._id}
                            value={type?._id}
                            className="capitalize"
                          >
                            {type?.title?.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      User Id
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a user id" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(userData)?.map((type) => (
                          <SelectItem
                            key={type?._id}
                            value={type?._id}
                            className="capitalize cursor-pointer"
                          >
                            {type?.email?.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Progress
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a progress" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object.values(LessonProgressScore)
                          .filter((value) => typeof value === "number")
                          .map((value) => (
                            <SelectItem
                              key={value.toString()}
                              value={value.toString()} // Pass value as a string
                              className="capitalize"
                            >
                              {value.toString() + "%"}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                onClick={() => onClose()}
                className="text-black rounded-[4px]"
              >
                No, cancel
              </Button>
              <Button disabled={isLoading} variant="ghost">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
