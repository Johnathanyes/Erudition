"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function ChatPanel({
  params,
}: {
  params: {
    documentId: Id<"documents">;
  };
}) {
  

  return (
    <div className="w-[300px] bg-gray-900 flex flex-col gap-2 p-4">
        <div className="overflow-y-auto h-[550px]">
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            <div className="p-4 bg-gray-700">asdgadnsdv</div>
            

        </div>
        <div className="flex gap-1">
            <form onSubmit={(event) => {
                event.preventDefault();

            }}>
                <Input required name="text"/>
                <Button>Submit</Button>
            </form>
        </div>
    </div>
  );
}
