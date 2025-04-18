"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import DocumentViewer from "@/components/documents/DocumentViewer";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, status } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/documents/${slug}`);
    }
  }, [status, router, slug]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="container max-w-7xl mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-[60vh] w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  // If authenticated, show document viewer
  if (status === "authenticated" && user) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <DocumentViewer slug={slug} />
      </div>
    );
  }

  // This should not be reached, but just in case
  return null;
}