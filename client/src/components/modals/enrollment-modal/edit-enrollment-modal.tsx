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
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import { useEffect, useState } from "react";
import { apiGetAllUser } from "@/services/user.services";
import { apiGetAllCourse } from "@/services/course.services";
import { EnrollmentProgress, EnrollmentStatus } from "@/types/enrollment";
import { apiUpdateEnrollment } from "@/services/enrollment.services";
const formSchema = z.object({
  courseId: z.string().min(1, {
    message: "CourseId is required",
  }),
  userId: z.string().min(1, {
    message: "User Id is required",
  }),
  progress: z.number().min(0, {
    message: "Progress must be at least 0",
  }),
  status: z.enum(["in_progress", "completed", "dropped"], {
    message: "Status is required",
  }),
});
export const EditEnrollmentModal = () => {
  const [courseData, setCourseData] = useState([]);
  const [userData, setUserData] = useState([]);
  const { isOpen, onClose, type, data } = useModal();
  const { enrollment } = data;
  const isModalOpen = isOpen && type === "editEnrollment";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      userId: "",
      progress: 0,
      status: "in_progress",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await apiUpdateEnrollment(enrollment?._id, {
      ...values,
      userId: { _id: values.userId },
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
    const course = await apiGetAllCourse();
    if (course.data.success) {
      setCourseData(course.data.rs);
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
    if (enrollment) {
      form.setValue("courseId", enrollment.courseId?._id);
      form.setValue("userId", enrollment.userId?._id);
      form.setValue("progress", enrollment.progress);
      form.setValue("status", enrollment.status);
    }
  }, [form, enrollment]);
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllCourse(), getAllUser()]);
    };
    fetchData();
  }, []);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Enrollment
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
                name="progress"
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
                        {Object.values(EnrollmentProgress)
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Status
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white shadow-lg border border-gray-300">
                        {Object?.values(EnrollmentStatus)?.map((type) => (
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
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
