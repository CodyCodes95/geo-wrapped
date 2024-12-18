"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Wrapped = dynamic(() => import("./components/Wrapped"), { ssr: false });

export default function Page() {
  return <Wrapped />;
}
