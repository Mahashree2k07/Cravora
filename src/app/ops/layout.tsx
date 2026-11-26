"use client";

import "./ops.css";
import type { ReactNode } from "react";

export default function OpsLayout({ children }: { children: ReactNode }) {
  return <div className="ops-portal">{children}</div>;
}
