"use client";
import { useEffect, useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Quote, Link2, Heading2, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/lib/toast";

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    if (ref.current && !initialized.current) {
      ref.current.innerHTML = value || "<p></p>";
      initialized.current = true;
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertImage = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      exec("insertHTML", `<img src="${data.url}" alt="" />`);
    } catch (e) {
      push(e instanceof Error ? e.message : "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const buttons: { icon: React.ReactNode; cmd: string; arg?: string; label: string }[] = [
    { icon: <Heading2 size={16} />, cmd: "formatBlock", arg: "H2", label: "Heading" },
    { icon: <Bold size={16} />, cmd: "bold", label: "Bold" },
    { icon: <Italic size={16} />, cmd: "italic", label: "Italic" },
    { icon: <List size={16} />, cmd: "insertUnorderedList", label: "Bullet list" },
    { icon: <ListOrdered size={16} />, cmd: "insertOrderedList", label: "Numbered list" },
    { icon: <Quote size={16} />, cmd: "formatBlock", arg: "BLOCKQUOTE", label: "Quote" },
  ];

  return (
    <div className="rounded-xl border border-ink/15">
      <div className="flex flex-wrap gap-1 border-b border-ink/10 p-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            title={b.label}
            onClick={() => exec(b.cmd, b.arg)}
            className="grid h-8 w-8 place-items-center rounded-md text-ink hover:bg-surface"
          >
            {b.icon}
          </button>
        ))}
        <button
          type="button"
          title="Link"
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) exec("createLink", url);
          }}
          className="grid h-8 w-8 place-items-center rounded-md text-ink hover:bg-surface"
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          title="Insert image"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="grid h-8 w-8 place-items-center rounded-md text-ink hover:bg-surface disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && insertImage(e.target.files[0])}
        />
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        className="min-h-[280px] px-5 py-4 text-[15.5px] leading-relaxed text-ink outline-none [&_h2]:font-condensed [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-accent [&_a]:underline [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-lg"
      />
    </div>
  );
}
