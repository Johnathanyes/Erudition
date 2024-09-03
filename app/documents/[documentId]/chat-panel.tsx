"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import QuestionForm from "./question-form";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });
  const askQuestion = useAction(api.documents.askQuestion);

  return (
    <div className="bg-gray-900 flex flex-col gap-2 p-6 rounded-md">
      <div className="overflow-y-auto h-[350px] space-y-4">
        <div className="bg-slate-950 rounded p-3">
          AI: Ask any question using AI about this document below:
        </div>
        {chats?.map((chat) => (
          <div
            className={cn(
              {
                "bg-slate-800": chat.isHuman,
                "text-right": chat.isHuman,
              },
              "rounded p-2 whitespace-pre-line"
            )}
          >
            {chat.isHuman ? "You" : "AI"}: {chat.text}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <QuestionForm documentId={documentId}/>
      </div>
    </div>
  );
}
