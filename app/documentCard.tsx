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

import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";

const DocumentCard = ({document}: {document: Doc<"documents">}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{!document.description ? <Loader2 className="animate-spin" /> : document.description}</p>
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
