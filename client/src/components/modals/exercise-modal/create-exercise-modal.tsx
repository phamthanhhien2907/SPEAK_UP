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
import { DifficultyLevelType, ExcerciseType } from "@/types/excercise";
import { apiCreateExercise } from "@/services/exercise.services";
const formSchema = z.object({
  lessonId: z.string().min(1, {
    message: "Lesson ID is required",
  }),
  type: z.enum(
    ["repeat_sentence", "fill_in_blank", "pronunciation", "listening"],
    {
      message: "Type is required",
    }
  ),
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
  correctPronunciation: z.string().min(1, {
    message: "CorrectPronunciation is required",
  }),
  difficultyLevel: z.string().min(1, {
    message: "DifficultyLevel is required",
  }),
});
export const CreateExerciseModal = () => {
  const [lessonData, setLessonData] = useState([]);
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "createExercise";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonId: "",
      type: "repeat_sentence",
      correctPronunciation: "",
      difficultyLevel: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await apiCreateExercise({
      ...values,
      lessonId: { _id: values.lessonId },
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
  const getAllCourse = async () => {
    const lesson = await apiGetAllLesson();
    if (lesson.data.success) {
      setLessonData(lesson.data.rs);
    } else {
      console.log("Failed to fetch users");
    }
  };
  useEffect(() => {
    getAllCourse();
  }, []);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Exercise
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="lessonId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Lesson Id
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Type
                      </FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                            <SelectValue placeholder="Select a excercise type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white shadow-lg border border-gray-300">
                          {Object?.values(ExcerciseType)?.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type?.toLocaleLowerCase()}
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
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Prompt
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter prompt"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="correctPronunciation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Correct Pronunciation
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter correct pronunciation"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Difficulty Level
                      </FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                            <SelectValue placeholder="Select a difficulty level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white shadow-lg border border-gray-300">
                          {Object?.values(DifficultyLevelType)?.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type?.toLocaleLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
