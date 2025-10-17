import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const allowedFields = ['firstName', 'lastName', 'country', 'city', 'region'] as const;
type Allowed = (typeof allowedFields)[number];
export type ProfileInput = Partial<Record<Allowed, string | null>>;

export function sanitizeProfileInput(body: any): ProfileInput {
  const out: ProfileInput = {};
  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      const v = (body as any)[key];
      (out as any)[key] = v ? String(v) : null;
    }
  }
  return out;
}

export async function getProfileByUserId(userId: string): Promise<any> {
  return prisma.profile.findUnique({ where: { userId } });
}

export async function createProfileForUser(userId: string, body: any): Promise<any> {
  const existing = await getProfileByUserId(userId);
  if (existing) return null;
  const data = sanitizeProfileInput(body);
  return prisma.profile.create(
    { data: 
      { 
        userId, 
        ...data 
      } 
    });
}

export async function getOrCreateProfileForUser(
  userId: string
): Promise<{ profile: any; created: boolean }> {
  const existing = await getProfileByUserId(userId);
  if (existing) return { 
    profile: existing, created: false 
  };
  const created = await prisma.profile.create({ data: { userId } });
  return { profile: created, created: true };
}

export async function updateProfileForUser(userId: string, body: any): Promise<any> {
  const existing = await getProfileByUserId(userId);
  if (!existing) return null;
  const data = sanitizeProfileInput(body);
  return prisma.profile.update({ where: { userId }, data });
}

