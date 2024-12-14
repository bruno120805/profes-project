"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface School {
  name: string;
  description: string;
}

async function fetchSchool(id: string): Promise<School | null> {
  const res = await fetch(`http://localhost:3003/api/school/${id}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

const SchoolPage = () => {
  const params = useParams();
  const [school, setSchool] = useState<School | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchool = async () => {
      if (typeof params.id === 'string') {
        const data = await fetchSchool(params.id);
        if (data) {
          setSchool(data);
        } else {
          setError("School not found");
        }
      } else {
        setError("Invalid school ID");
      }
    };
    
    loadSchool();
  }, [params.id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!school) {
    return null;
  }

  return (
    <div>
      <h1>{school.name}</h1>
      <p>{school.description}</p>
    </div>
  );
};

export default SchoolPage;
