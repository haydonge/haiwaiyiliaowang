import { cn } from "@/lib/utils";
import { FileX, Search } from "lucide-react";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

// Empty component
export default function Empty({ 
  title = "暂无数据", 
  description = "当前没有可显示的内容", 
  icon,
  className 
}: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="text-gray-400 mb-4">
        {icon || <FileX className="w-16 h-16" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md">{description}</p>
    </div>
  );
}