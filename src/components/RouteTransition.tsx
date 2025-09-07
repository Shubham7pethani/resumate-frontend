"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteTransition() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    body.classList.add("route-change-start");
    const t = setTimeout(() => {
      body.classList.remove("route-change-start");
      body.classList.add("route-change-end");
      setTimeout(() => body.classList.remove("route-change-end"), 200);
    }, 180);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}