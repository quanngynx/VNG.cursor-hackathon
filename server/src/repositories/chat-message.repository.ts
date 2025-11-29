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

    return this.findAll({
      where,
      orderBy: { field: 'createdAt', direction: 'asc' },
      limit,
    });
  }
}
