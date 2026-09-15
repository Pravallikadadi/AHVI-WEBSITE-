"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/lib/toast";

export function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { push } = useToast();

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      push("Image uploaded");
    } catch (e) {
      push(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-ink/10" style={{ aspectRatio: "16/9" }}>
        <Image src={value} alt="Cover" fill style={{ objectFit: "cover" }} />
        <div className="absolute right-2 top-2 flex gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-ink/80 px-3 py-1.5 text-[11px] tracking-[0.08em] text-bg"
          >
            Replace
          </button>
          <button type="button" onClick={() => onChange("")} className="grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-bg">
            <X size={14} />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={uploading}
      onClick={() => inputRef.current?.click()}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 bg-surface py-12 text-muted hover:border-ink/40"
    >
      {uploading ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
      <span className="text-[13px]">{uploading ? "Uploading..." : "Click to upload cover image"}</span>
      <span className="text-[11px] text-muted2">JPG, PNG or WebP — up to 8MB</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
    </button>
  );
}
