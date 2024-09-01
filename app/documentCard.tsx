import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";

import { Eye } from "lucide-react";
import Link from "next/link";

const DocumentCard = ({document}: {document: Doc<"documents">}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
            <Button asChild variant="secondary" className="flex gap-2 items-center">
              <Link href={`/documents/${document._id}`}>
                <Eye className="w-4 h-4"/> 
                View Document
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default DocumentCard
