type MessageBubbleProps = {
  text: string;
  index: number;
};

export default function MessageBubble({ text , index}: MessageBubbleProps) {
  return (
    <div className="flex justify-start" key={index}>
      <div
        className="max-w-[80%] px-3 py-2 rounded-xl text-sm bg-gray-800 text-white break-words
        whitespace-pre-wrap
        overflow-wrap: break-word">
        {text}
      </div>
    </div>
  );
}