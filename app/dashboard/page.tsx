"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DocumentCard from "../documentCard";
import UploadDocumentButton from "../upload-document-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { SignIn, SignInButton } from "@clerk/nextjs";

export default function Dashboard() {
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="p-24 space-y-8">
      <Unauthenticated>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl text-center mb-20">Sign in to Access Dashboard</h1>
          <SignInButton />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">My Documents</h1>
          <UploadDocumentButton />
        </div>

        {!documents && (
          <div className="grid grid-cols-3 gap-8">
            {new Array(9).fill("").map((_, i) => (
              <Card
                className="h-[200px] p-6 flex flex-col justify-between"
                key={i}
              >
                <Skeleton className="h-[20px] rounded" />
                <Skeleton className="h-[20px] rounded" />
                <Skeleton className="h-[20px] rounded" />
                <Skeleton className="w-[80px] h-[40px] rounded" />
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {documents?.map((document) => (
            <DocumentCard document={document} key={document._id} />
          ))}
        </div>

        {documents && documents.length === 0 && (
          <div className="py-12 flex flex-col justify-center items-center gap-8">
            <Image
              src="/undraw_documents_re_isxv.svg"
              width={250}
              height={250}
              alt="Image of girl holding papers"
            />
            <h2 className="text-2xl">
              You have no documents. Upload some Documents!
            </h2>
            <UploadDocumentButton />
          </div>
        )}
      </Authenticated>
    </main>
  );
}
