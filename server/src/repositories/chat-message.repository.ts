import { BaseRepository, QueryOptions } from './base.repository';
import { ChatMessage, chatMessageSchema } from '@/schemas/chat-message.schema';
import { WhereFilterOp } from '@google-cloud/firestore';

/**
 * Chat message repository for chat message-specific operations
 */
export class ChatMessageRepository extends BaseRepository<ChatMessage> {
  constructor() {
    super('chat_messages', chatMessageSchema);
  }

  /**
   * Find chat messages by user ID
   */
  async findByUserId(userId: string, limit = 50): Promise<ChatMessage[]> {
    return this.findAll({
      where: [
        { field: 'userId', operator: '==' as WhereFilterOp, value: userId },
      ],
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit,
    });
  }

  /**
   * Find chat messages by guest ID
   */
  async findByGuestId(guestId: string, limit = 50): Promise<ChatMessage[]> {
    return this.findAll({
      where: [
        { field: 'guestId', operator: '==' as WhereFilterOp, value: guestId },
      ],
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit,
    });
  }

  /**
   * Get conversation history
   * Note: We fetch all messages and sort in memory to avoid needing composite index
   */
  async getConversationHistory(
    userId?: string,
    guestId?: string,
    limit = 20,
  ): Promise<ChatMessage[]> {
    const where: QueryOptions['where'] = [];

    if (userId) {
      where.push({
        field: 'userId',
        operator: '==' as WhereFilterOp,
        value: userId,
      });
    } else if (guestId) {
      where.push({
        field: 'guestId',
        operator: '==' as WhereFilterOp,
        value: guestId,
      });
    }

    // Fetch all messages without orderBy to avoid needing composite index
    // We'll sort in memory instead
    const allMessages = await this.findAll({
      where,
      // No orderBy here - will sort in memory
    });

    // Sort by createdAt ascending in memory
    const sorted = allMessages.sort((a, b) => {
      const dateA =
        a.createdAt instanceof Date
          ? a.createdAt
          : new Date(a.createdAt as string);
      const dateB =
        b.createdAt instanceof Date
          ? b.createdAt
          : new Date(b.createdAt as string);
      return dateA.getTime() - dateB.getTime();
    });

    // Apply limit after sorting
    return sorted.slice(0, limit);
  }
}
