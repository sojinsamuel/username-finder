import { create } from "zustand";
import { Hanko } from "@teamhanko/hanko-elements";

export const hankoStore = create((set) => ({
  hanko: {},
  fetch: async () => {
    "use client";
    const instance = new Hanko(process.env.NEXT_PUBLIC_HANKO_API_URL!);
    set({ hanko: await instance.user.getCurrent() });
  },
}));
