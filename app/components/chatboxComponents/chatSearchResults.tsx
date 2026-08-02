import type { SearchResult } from "@/app/hooks/useChatWindow";

type ChatSearchResultsProps = {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
};

export function ChatSearchResults({ results, onSelect }: ChatSearchResultsProps) {
  return (
    <div className="space-y-2">
      {results.map((result) => (
        <button
          key={result.documentId}
          type="button"
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-left text-sm hover:bg-gray-800"
          onClick={() => onSelect(result)}
        >
          {result.documentName}
        </button>
      ))}
    </div>
  );
}
