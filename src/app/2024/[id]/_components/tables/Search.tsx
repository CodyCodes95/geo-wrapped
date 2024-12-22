import { Input } from "~/components/ui/input";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const Search = ({ value, onChange }: SearchProps) => {
  return (
    <Input
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm"
    />
  );
};
