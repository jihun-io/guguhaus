import { getMerchData } from "@/utils/getData";
import MerchClient from "@/components/merch/MerchClient";

export default async function MerchPage() {
  const merchData = await getMerchData();

  return <MerchClient merchandises={merchData} />;
}
