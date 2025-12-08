"use client";

import Navbar from "@/components/pages/Navbar";
import Footer from "@/components/pages/Footer";
import TestPage from "@/components/pages/test";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const mockTestId = Number(params.mockTestId);

  return (
    <>
      <Navbar />
      <TestPage mockTestId={mockTestId} />
      <Footer />
    </>
  );
}
