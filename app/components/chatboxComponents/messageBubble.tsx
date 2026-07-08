type MessageBubbleProps = {
  text: string;
  index: number;
  variant?: "assistant" | "user";
  actions?: React.ReactNode;
};

export default function MessageBubble({ text, index, variant = "assistant", actions }: MessageBubbleProps) {
  return (
    <div className={`flex ${variant === "user" ? "justify-end" : "justify-start"}`} key={index}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm break-words whitespace-pre-wrap overflow-wrap: break-word ${
          variant === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
        }`}
      >
        <div>{text}</div>
        {actions ? <div className="mt-2 space-y-2">{actions}</div> : null}
      </div>
    </div>
  );
}