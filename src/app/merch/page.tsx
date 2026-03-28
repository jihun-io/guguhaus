import { getMerchData } from "@/utils/getData";

export const dynamic = "force-dynamic";
import MerchClient from "@/components/merch/MerchClient";

export default async function MerchPage() {
  const merchData = await getMerchData();

  return <MerchClient merchandises={merchData} />;
}
