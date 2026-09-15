"use client";
export function DeleteBlogModal({
  title,
  onCancel,
  onConfirm,
  deleting,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[150] grid place-items-center bg-ink/40 p-5" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[420px] rounded-2xl bg-bg p-7">
        <div className="mb-2 font-condensed text-[22px] font-semibold">Delete blog?</div>
        <p className="mb-6 text-[14.5px] leading-relaxed text-muted">
          Are you sure you want to delete <strong className="text-ink">&ldquo;{title}&rdquo;</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2.5">
          <button onClick={onCancel} className="rounded-full border border-ink/15 px-5 py-2.5 text-[13px] tracking-[0.06em]">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-full bg-error px-5 py-2.5 text-[13px] tracking-[0.06em] text-bg disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}
