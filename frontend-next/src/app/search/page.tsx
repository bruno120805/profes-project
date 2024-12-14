"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export function TypographyH4() {
  return (
    <h4
      className="scroll-m-20 text-xl font-semibold tracking-tight mt-3 "
      style={{ ...inter.style }}
    >
      Escribe el nombre de la universidad para empezar.
    </h4>
  );
}

interface School {
  name: string;
  id: string;
}

const SearchPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  useEffect(() => {
    const fetchSchools = async () => {
      if (q) {
        try {
          const response = await fetch(
            `http://localhost:3003/api/search?buscar=Escuelas&q=${q}`
          );
          const data = await response.json();
          if (Array.isArray(data)) {
            setSchools(data);
          } else {
            setError("No se encontraron escuelas");
          }
        } catch (error) {
          console.error("Error fetching schools:", error);
        }
      }
    };

    fetchSchools();
  }, [q]);
  
  return (
    <div>
      <h1>Resultados de búsqueda para: {q}</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {schools.map((school, index) => (
            <li key={index}>
              <Link href={`/school/${school.id}`}>
                {school.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
