import Image from "next/image";
import { Button } from "../ui/button";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  isLoading: boolean;
}

const SubmitButton = ({ isLoading, children, className }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? <div className="flex items-center gap-4">
        <Image width={24} height={24} src="/icons/loader.svg" alt="loader" className="animate-spin" />
        Loading...
      </div> : children}
    </Button>
  );
};

export default SubmitButton;
