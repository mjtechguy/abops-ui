"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Credentials() {
  const router = useRouter();
  
  // Redirect to the provider credentials page
  useEffect(() => {
    router.push("/apps/abops/credentials/provider");
  }, [router]);
  
  // Return null as this page will redirect
  return null;
}
