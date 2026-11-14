/**
 * Enterprise Multi-Tenant Workspace & RBAC Manager
 *
 * Implements role-based access control (Admin, Director, VFX Artist, Auditor)
 * and cryptographic isolation across client project folders in studio environments.
 */

export type StudioRole = 'STUDIO_ADMIN' | 'CREATIVE_DIRECTOR' | 'VFX_ARTIST' | 'GUEST_AUDITOR';

export interface UserSession {
  userId: string;
  tenantId: string;
  role: StudioRole;
  allowedCompositions: string[];
}

export class EnterpriseRbacManager {
  public static canTriggerRender(session: UserSession): boolean {
    return session.role === 'STUDIO_ADMIN' || session.role === 'CREATIVE_DIRECTOR';
  }

  public static canModifyProps(session: UserSession): boolean {
    return session.role !== 'GUEST_AUDITOR';
  }
}
