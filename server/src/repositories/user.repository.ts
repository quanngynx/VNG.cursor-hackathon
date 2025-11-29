import { BaseRepository } from './base.repository';
import { User, userSchema } from '@/schemas/user.schema';

/**
 * User repository for user-specific operations
 */
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users', userSchema);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const results = await this.findAll({
      where: [{ field: 'email', operator: '==', value: email }],
      limit: 1,
    });

    return results[0] || null;
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    return this.findAll({
      where: [{ field: 'role', operator: '==', value: role }],
    });
  }

  /**
   * Find active users
   */
  async findActiveUsers(): Promise<User[]> {
    return this.findAll({
      where: [{ field: 'isActive', operator: '==', value: true }],
    });
  }

  /**
   * Update last login time
   */
  async updateLastLogin(userId: string): Promise<User | null> {
    return this.update(userId, {
      lastLoginAt: new Date(),
    });
  }
}
