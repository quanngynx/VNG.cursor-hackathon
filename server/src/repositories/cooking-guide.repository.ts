import { BaseRepository } from './base.repository'
import { CookingGuide, cookingGuideSchema } from '@/schemas/cooking-guide.schema'
import { WhereFilterOp } from '@google-cloud/firestore'

/**
 * Cooking guide repository for cooking guide-specific operations
 */
export class CookingGuideRepository extends BaseRepository<CookingGuide> {
  constructor() {
    super('cooking_guides', cookingGuideSchema)
  }

  /**
   * Find cooking guides by user ID
   */
  async findByUserId(userId: string, limit = 50): Promise<CookingGuide[]> {
    const results = await this.findAll({
      where: [
        { field: 'userId', operator: '==' as WhereFilterOp, value: userId },
      ],
    })

    // Sort by createdAt descending in memory
    return results
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as string)
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as string)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, limit)
  }

  /**
   * Find cooking guides by guest ID
   */
  async findByGuestId(guestId: string, limit = 50): Promise<CookingGuide[]> {
    const results = await this.findAll({
      where: [
        { field: 'guestId', operator: '==' as WhereFilterOp, value: guestId },
      ],
    })

    // Sort by createdAt descending in memory
    return results
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as string)
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as string)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, limit)
  }

  /**
   * Find cooking guide by ID
   */
  async findByGuideId(id: string): Promise<CookingGuide | null> {
    return this.findById(id)
  }
}

