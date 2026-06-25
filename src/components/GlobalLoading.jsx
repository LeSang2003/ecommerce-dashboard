import { useState } from "react";
import { useLoading } from "../context/LoadingContext";

export default function GlobalLoading() {
  const { loading } = useLoading();
  if (!loading) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
