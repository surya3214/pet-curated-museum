import type { InterleavedExhibitResponse } from "../types/exhibit";

type Props = {
  exhibit: InterleavedExhibitResponse;
};

export function InterleavedExhibit({ exhibit }: Props) {
  return (
    <div className="space-y-4">
      {exhibit.blocks.map((block, idx) => {
        if (block.type === "text") {
          return (
            <div key={idx} className="rounded-xl bg-stone-50 p-4 shadow-sm">
              <p className="text-sm leading-7 text-stone-800">{block.text}</p>
            </div>
          );
        }

        return (
          <div key={idx} className="overflow-hidden rounded-xl shadow-sm">
            <img
              src={`data:${block.mime_type};base64,${block.data_base64}`}
              alt={`Exhibit block ${idx}`}
              className="w-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
