import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export function SearchBox({ value, onChange, placeholder, className }: SearchBoxProps) {
  return (
    <div className={cn("relative w-full md:w-[390px]", className)}>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-r-none pr-12"
      />
      <div className="absolute right-0 top-0 grid h-12 w-12 place-items-center rounded-r-md bg-[#168bd3] text-white">
        <Search className="h-5 w-5" />
      </div>
    </div>
  );
}
