"use client";
import { useEffect, useState } from "react";
import { AhviLogo } from "@/components/ahvi-logo";
import { AhviLoader } from "@/components/ahvi-loader";

type NetworkConnection = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function getConnection(): NetworkConnection | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as Navigator & {
    connection?: NetworkConnection;
    mozConnection?: NetworkConnection;
    webkitConnection?: NetworkConnection;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

/** Watches connectivity and surfaces the AHVI logo as a full-screen loader when offline, or a slim banner on a detected slow connection. */
export function NetworkStatus() {
  const [offline, setOffline] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);

    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const connection = getConnection();
    const updateSlow = () => {
      if (!connection) return;
      setSlow(connection.saveData === true || connection.effectiveType === "2g" || connection.effectiveType === "slow-2g");
    };
    updateSlow();
    connection?.addEventListener?.("change", updateSlow);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      connection?.removeEventListener?.("change", updateSlow);
    };
  }, []);

  if (offline) {
    return <AhviLoader label="You're offline" />;
  }

  if (slow) {
    return (
      <div className="fixed left-1/2 top-[74px] z-[150] flex -translate-x-1/2 items-center gap-2.5 border border-ink/15 bg-bg px-4 py-2.5 text-[12.5px] text-muted shadow-lg">
        <AhviLogo size={18} />
        Slow connection — things may take a little longer to load.
      </div>
    );
  }

  return null;
}
