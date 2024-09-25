"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import LoadingButton from "@/app/loading-button";
import { Id } from "@/convex/_generated/dataModel";


const formSchema = z.object({
  text: z.string().min(3).max(260),
});

const QuestionForm = ({ documentId }: { documentId: Id<"documents"> }) => {
  const askQuestion = useAction(api.documents.askQuestion);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await askQuestion({ question: values.text, documentId});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 gap-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Ask any question about your document..." {...field} className="hover:cursor-pointer"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Submitting..."
        >
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
};

export default QuestionForm;
