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
import { apiGetAllExercise } from "@/services/exercise.services";
import { apiGetAllLesson } from "@/services/lesson.services";
import { apiGetAllUser } from "@/services/user.services";
import { AttemptsType } from "@/types/history";
import { apiUpdateHistory } from "@/services/history.services";
const formSchema = z.object({
  userId: z.string().min(1, {
    message: "CourseId is required",
  }),
  lessonId: z.string().min(1, {
    message: "Lesson Id is required",
  }),
  exerciseId: z.string().min(1, {
    message: "Exercise Id is required",
  }),
  attempts: z.number().min(1, {
    message: "Progress must be at least 1",
  }),
  lastAttemptAt: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val))
    .optional(),
});
export const EditHistoryModal = () => {
  const [lessonData, setLessonData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);

  const [userData, setUserData] = useState([]);
  const { isOpen, onClose, type, data } = useModal();
  const { history } = data;
  const isModalOpen = isOpen && type === "editHistory";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      lessonId: "",
      exerciseId: "",
      attempts: 1,
      lastAttemptAt: new Date(),
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const res = await apiUpdateHistory(history?._id, {
      ...values,
      userId: { _id: values.userId },
      lessonId: { _id: values.lessonId },
      exerciseId: { _id: values.exerciseId },
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
  const getAllExercise = async () => {
    const exercise = await apiGetAllExercise();
    if (exercise.data.success) {
      setExerciseData(exercise.data.rs);
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
    if (history) {
      form.setValue("lessonId", history.lessonId?._id);
      form.setValue("userId", history.userId?._id);
      form.setValue("exerciseId", history.exerciseId?._id);
      form.setValue("attempts", history.attempts);
      form.setValue("lastAttemptAt", new Date(history.lastAttemptAt));
    }
  }, [form, history]);
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllLesson(), getAllExercise(), getAllUser()]);
    };
    fetchData();
  }, []);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit History
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
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
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(userData)?.map((type) => (
                          <SelectItem
                            key={type?._id}
                            value={type?._id}
                            className="capitalize"
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
                          <SelectValue placeholder="Select a lesson id" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(lessonData)?.map((type) => (
                          <SelectItem
                            key={type?._id}
                            value={type?._id}
                            className="capitalize cursor-pointer"
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
                name="exerciseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Exercise Id
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a exercise id" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(exerciseData)?.map((type) => (
                          <SelectItem
                            key={type?._id}
                            value={type?._id}
                            className="capitalize cursor-pointer"
                          >
                            {type?.prompt?.toLocaleLowerCase()}
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
                name="attempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Attempts
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
                        {Object.values(AttemptsType)
                          .filter((value) => typeof value === "number")
                          .map((value) => (
                            <SelectItem
                              key={value.toString()}
                              value={value.toString()} // Pass value as a string
                              className="capitalize"
                            >
                              {value.toString()}
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
                name="lastAttemptAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Last Attempt At
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(event) => {
                          const date = new Date(event.target.value);
                          if (!isNaN(date.getTime())) {
                            field.onChange(date);
                          }
                        }}
                      />
                    </FormControl>
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
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
