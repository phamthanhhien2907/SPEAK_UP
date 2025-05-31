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

import { useEffect, useState } from "react";
import { apiGetAllLesson, apiUpdateLesson } from "@/services/lesson.services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AIConversationEnabledType,
  CategoryType,
  LessonType,
} from "@/types/lesson";
import { apiGetAllCourse } from "@/services/course.services";
import { apiGetAllTopic } from "@/services/topic.services";
const formSchema = z.object({
  courseId: z.string().min(1, {
    message: "Course Id is required",
  }),
  parentTopicId: z.string(),
  parentLessonId: z.string(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  totalLessons: z.number(),
  content: z.string().min(1, {
    message: "Content is required",
  }),
  thumbnail: z.string(),
  aiImg: z.string(),
  name: z.string(),
  isAIConversationEnabled: z.enum(["true", "false"]),
  type: z.enum(["listening", "speaking", "vocabulary", "pronunciation"], {
    message: "Type is required",
  }),
  category: z.enum(["basics", "intermediate", "professional"], {
    message: "Category is required",
  }),
  level: z.number().min(1, {
    message: "Level Lesson is required",
  }),
});
export const EditLessonModal = () => {
  const [courseData, setCourseData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [lessonParentIdData, setLessonParentIdData] = useState([]);
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
      parentLessonId: "",
      parentTopicId: "",
      thumbnail: "",
      aiImg: "",
      name: "",
      isAIConversationEnabled: "false",
      totalLessons: null,
      category: "basics",
      level: 1,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await apiUpdateLesson(lesson?._id, {
      ...values,
      courseId: { _id: values.courseId },
      parentLessonId: values.parentLessonId
        ? { _id: values.parentLessonId }
        : undefined,
      parentTopicId: values.parentTopicId || undefined,
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
  const getAllTopic = async () => {
    const topic = await apiGetAllTopic();
    if (topic.data.success) {
      setTopicData(topic.data.rs);
    } else {
      console.log("Failed to fetch users");
    }
  };
  const getLessonByLessonParentId = async () => {
    const lessonParent = await apiGetAllLesson();
    if (lessonParent.data.success) {
      const filterLessonByParentId = lessonParent?.data?.rs?.filter(
        (lessonParentId) => lessonParentId?.parentLessonId
      );
      setLessonParentIdData(filterLessonByParentId);
    } else {
      console.log("Failed to fetch users");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getAllCourse(),
        getAllTopic(),
        getLessonByLessonParentId(),
      ]);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (lesson) {
      form.setValue("courseId", lesson.courseId?._id);
      form.setValue("parentLessonId", lesson.courseId?._id);
      form.setValue("parentTopicId", lesson.courseId?._id);
      form.setValue("content", lesson.content);
      form.setValue("title", lesson.title);
      form.setValue("aiImg", lesson.aiImg);
      form.setValue("thumbnail", lesson.thumbnail);
      form.setValue("name", lesson.name);
      form.setValue("category", lesson.category);
      form.setValue("level", lesson.level);
      form.setValue("type", lesson.type);
      form.setValue("isAIConversationEnabled", lesson.isAIConversationEnabled);
      form.setValue("totalLessons", lesson.totalLessons);
    }
  }, [form, lesson]);
  useEffect(() => {
    getAllCourse();
  }, []);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-y-auto h-screen">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Editt Lesson
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
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(courseData)?.map((type) => (
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
                name="parentTopicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Parent Topic Id
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel topic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(topicData)?.map((type) => (
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
                name="parentLessonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Parent Lesson Id
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel lesson" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(lessonParentIdData)?.map((type) => (
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
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Category
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(CategoryType)?.map((type) => (
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
                name="totalLessons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Total Lesson
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter total lesson"
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Thumbnail
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter thumbnail"
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
                name="aiImg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      AI Image
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter AI Image"
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter name"
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
                name="isAIConversationEnabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      AI Conversation Enabled
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a AI Conversation Enabled" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(AIConversationEnabledType)?.map(
                          (type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type?.toLocaleLowerCase()}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Level
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter level"
                        {...field}
                        type="number"
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
