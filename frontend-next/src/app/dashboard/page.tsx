"use client";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();

  const createSchool=async()=> {
    const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/school/`
    , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // token with cookies
      body: JSON.stringify({
        name: "school test1"
      })
    })
    const data = await res.json()
    console.log(data)
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
      <button onClick={createSchool}> Create school </button>
    </div>
  );
};
export default Dashboard;