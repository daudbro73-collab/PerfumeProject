"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const cleanup = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));

      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    };

    if (process.env.NODE_ENV === "production") {
      cleanup().then(() => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
      return;
    }

    cleanup();
  }, []);

  return null;
}
