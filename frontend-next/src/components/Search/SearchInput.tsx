"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SearchInput() {
  const [searchQuery, setSearchQuery] = useState(""); //solo se pueden usar hooks en client components
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/search?buscar=Escuelas&q=${searchQuery}`);
  };

  return (
    <form onSubmit={onSearch}>
      <Input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="
          px-5 
          py-1 
          w-2/3 
          sm:px-5 
          sm:py-3 
          flex-1 
        "
        placeholder="Escribe tu escuela"
      />
    </form>
  );
}

export default SearchInput;
