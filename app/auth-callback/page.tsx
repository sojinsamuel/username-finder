/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Hanko } from "@teamhanko/hanko-frontend-sdk";
import { title } from "@/components/primitives";
import { Progress } from "@nextui-org/react";
const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL!;
// const hanko = new Hanko(hankoApi);

function AuthCallBackPage() {
  const router = useRouter();
  const [hanko, setHanko] = useState<Hanko>();

  useEffect(() => {
    import("@teamhanko/hanko-frontend-sdk").then(({ Hanko }) =>
      setHanko(new Hanko(hankoApi))
    );
  }, []);

  async function getCurrentUser(currentUser: any) {
    try {
      if (currentUser && currentUser?.id) {
        const res = await fetch("/api/user-create-db", {
          method: "POST",
          body: JSON.stringify({
            id: currentUser?.id,
            email: currentUser?.email,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const dbUser = await res.json();

        console.log("====================================");
        console.log("Response inside auth callback page", dbUser);
        console.log("====================================");
        if (dbUser) {
          router.push(`/dashboard`);
        }
      }
    } catch (error) {
      console.error(error);
      router.push("/login");
    } finally {
      // router.push(origin ? `/${origin}` : "/dashboard");
    }
  }

  useEffect(() => {
    async function AuthProcess() {
      const currentUser = await hanko?.user.getCurrent();
      await getCurrentUser(currentUser);
    }

    if (hanko) {
      AuthProcess();
    }
  }, [hanko]);

  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <div>
        <h3 className={title()}>Setting up your account...</h3>
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className=" max-w-md ring-1 ring-white"
        />
      </div>
    </div>
  );
}

export default AuthCallBackPage;
