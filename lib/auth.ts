import {createHash,timingSafeEqual} from 'crypto';import {cookies} from 'next/headers';
const token=()=>createHash('sha256').update(`tile-admin:${process.env.ADMIN_PASSWORD||''}`).digest('hex');
export function validPassword(value:string){const expected=process.env.ADMIN_PASSWORD;if(!expected)return false;const a=Buffer.from(value),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)}
export async function isAdmin(){const c=(await cookies()).get('tile_admin')?.value;return Boolean(process.env.ADMIN_PASSWORD&&c===token())}
export function adminToken(){return token()}
