"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentPage({
  params,
}: {
  params: {
    documentId: Id<"documents">;
  };
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });


  return (
    <main className="p-24 space-y-8">
      {!document && (
        <div className="space-y-8">
          <div>
            <Skeleton className="h-[40px] w-[500px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-[40px] w-[80px]" />
            <Skeleton className="h-[40px] w-[80px]" />
          </div>
          <Skeleton className="h-[500px]" />
        </div>
      )}
      {document && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">{document?.title}</h1>
          </div>
          <div className="flex gap-12">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="mb-2 rounded-xl">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="document">
                <div className="bg-stone-950 p-4 rounded flex-1 h-[600px]">
                  {document.documentUrl && (
                    <iframe
                      src={document.documentUrl}
                      className="w-full h-full bg-stone-900"
                    ></iframe>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <ChatPanel documentId={params.documentId} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </main>
  );
}
