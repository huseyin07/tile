import {NextResponse} from "next/server";
import {adminDb} from "@/lib/supabase";

export async function GET(request:Request){
  const wallet=new URL(request.url).searchParams.get("wallet")?.trim()||"";
  if(!/^0x[a-fA-F0-9]{40}$/.test(wallet)) return NextResponse.json({found:false,error:"Invalid EVM wallet."},{status:400});
  const {data,error}=await adminDb().from("whitelist_applications").select("applicant_tile_number,x_username,wallet_address,status,verification_status").ilike("wallet_address",wallet).maybeSingle();
  if(error) return NextResponse.json({found:false,error:"Lookup unavailable."},{status:500});
  if(!data) return NextResponse.json({found:false});
  return NextResponse.json({found:true,tileNumber:data.applicant_tile_number,xUsername:data.x_username,wallet:data.wallet_address,status:data.status,verificationStatus:data.verification_status});
}
