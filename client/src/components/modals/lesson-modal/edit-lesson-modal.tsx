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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import { LessonType } from "@/types/lesson";
import { useEffect, useState } from "react";
import { apiGetAllCourse } from "@/services/course.services";
import { apiUpdateLesson } from "@/services/lesson.services";
import { Course } from "@/types/course";
const formSchema = z.object({
  courseId: z.string().min(1, {
    message: "CourseId is required",
  }),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  content: z.string().min(1, {
    message: "Content is required",
  }),
  type: z.enum(["listening", "speaking", "vocabulary"], {
    message: "Type is required",
  }),
});
export const EditLessonModal = () => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const { isOpen, onClose, type, data } = useModal();
  const { lesson } = data;
  const isModalOpen = isOpen && type === "editLesson";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      title: "",
      content: "",
      type: "listening",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const res = await apiUpdateLesson(lesson?._id, {
      ...values,
      courseId: { _id: values.courseId },
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
    const courses = await apiGetAllCourse();
    if (courses.data.success) {
      setCourseData(courses.data.rs);
    } else {
      console.log("Failed to fetch users");
    }
  };
  useEffect(() => {
    getAllCourse();
  }, []);
  useEffect(() => {
    if (lesson && courseData?.length > 0) {
      form.setValue("courseId", lesson.courseId._id);
      form.setValue("title", lesson.title);
      form.setValue("content", lesson.content);
      form.setValue("type", lesson.type);
    }
  }, [form, lesson, courseData]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Update Lesson
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="courseId"
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
                          <SelectValue placeholder="Select a course type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(courseData)?.map((type) => (
                          <SelectItem
                            key={type?._id}
                            value={type?._id}
                            className="capitalize"
                          >
                            {type?.title.toLowerCase()}
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter title"
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Content
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter content"
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
                          <SelectValue placeholder="Select a lesson" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(LessonType)?.map((type) => (
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
