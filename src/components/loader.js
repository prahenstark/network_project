import { Loader2 } from "lucide-react";

// components/loader.js
export default function Loader() {
  return (
    <div className="loader flex justify-center flex-col items-center gap-6 p-10">
      <Loader2 className="animate-spin" />
      <p>Loading...</p>
    </div>
  );
}
