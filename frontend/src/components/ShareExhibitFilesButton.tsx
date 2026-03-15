import { useMemo, useState } from "react";

type ShareExhibitFilesButtonProps = {
  imageDataUrls: string[];
  title?: string;
  caption?: string;
  className?: string;
};

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [meta, base64] = dataUrl.split(",");
  if (!meta || !base64) {
    throw new Error("Invalid data URL");
  }

  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] || "image/png";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const ext = mimeType.includes("jpeg") || mimeType.includes("jpg")
    ? "jpg"
    : mimeType.includes("webp")
      ? "webp"
      : "png";

  return new File([bytes], `${filename}.${ext}`, { type: mimeType });
}

export default function ShareExhibitFilesButton({
  imageDataUrls,
  title = "Pet-Curated Museum of a Day",
  caption = "A tiny AI museum exhibit narrated by my pet.",
  className = "",
}: ShareExhibitFilesButtonProps) {
  const [status, setStatus] = useState<"idle" | "sharing" | "copied">("idle");

  const trimmedImages = useMemo(
    () => imageDataUrls.filter(Boolean).slice(0, 3),
    [imageDataUrls]
  );

  const shareText = useMemo(() => {
    return `${title}\n\n${caption}`.trim();
  }, [title, caption]);

  const handleShare = async () => {
    try {
      setStatus("sharing");

      const files = trimmedImages.map((dataUrl, index) =>
        dataUrlToFile(dataUrl, `pet-curated-museum-${index + 1}`)
      );

      if (
        navigator.share &&
        files.length > 0 &&
        navigator.canShare &&
        navigator.canShare({ files })
      ) {
        await navigator.share({
          title,
          text: caption,
          files,
        });
        setStatus("idle");
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        setStatus("copied");
        window.setTimeout(() => setStatus("idle"), 1800);
      } catch {
        alert("Share failed. Please save the images manually and paste the caption.");
        setStatus("idle");
      }
    }
  };

  const label =
    status === "sharing" ? "Sharing..." :
    status === "copied" ? "Caption copied" :
    "Share";

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={status === "sharing" || trimmedImages.length === 0}
      className={[
        "inline-flex items-center gap-2 rounded-full border border-white/15",
        "bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.22em] text-white/90",
        "transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
    >
      <span>{label}</span>
    </button>
  );
}
