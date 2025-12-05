import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { Suspense } from "react";

/**
 * Supabase 공식 문서 예시를 참고한 테스트 페이지
 * 
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
async function InstrumentsData() {
  const supabase = createClerkSupabaseClient();
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select();

  if (error) {
    throw error;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Instruments</h1>
      {instruments && instruments.length > 0 ? (
        <ul className="list-disc list-inside space-y-2">
          {instruments.map((instrument: any) => (
            <li key={instrument.id} className="text-lg">
              {instrument.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          No instruments found. Please create the table and add data in Supabase.
        </p>
      )}
    </div>
  );
}

export default function Instruments() {
  return (
    <Suspense fallback={<div className="p-6">Loading instruments...</div>}>
      <InstrumentsData />
    </Suspense>
  );
}



