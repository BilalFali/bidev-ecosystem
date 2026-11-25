import { getD1 } from "@/lib/d1";
import { getAccessIdentity } from "@/lib/cloudflare-access";

export async function createClient() {
  const d1 = getD1("DB");
  if (!d1) throw new Error("D1 database binding is unavailable");
  return {
    auth: {
      async getUser() {
        const user = await getAccessIdentity();
        return { data: { user }, error: user ? null : new Error("Cloudflare Access identity missing") };
      },
    },
    ...d1,
  };
}
