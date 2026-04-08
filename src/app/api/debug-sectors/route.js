import { NextResponse } from 'next/server';
import { getSectors } from '@/lib/services/sectors';

export async function GET() {
  try {
    const sectors = await getSectors();
    const cleanSectors = sectors.map(s => ({
      id: s.id,
      name: s.name,
      color: s.color || 'null',
      icon: s.icon || 'null',
      nameLength: s.name.length,
      charCode_0: s.name.charCodeAt(0)
    }));
    
    console.log("=== DEBUG SECTORS PE (JSON) ===", JSON.stringify(cleanSectors));
    return NextResponse.json(cleanSectors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
