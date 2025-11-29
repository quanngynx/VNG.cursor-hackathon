import {
  DocumentData,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  WhereFilterOp,
  OrderByDirection,
  DocumentSnapshot,
} from '@google-cloud/firestore';
import { z } from 'zod/v4';
import { getFirestore } from '@/configs/firebase';

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    field: string;
    direction: OrderByDirection;
  };
  where?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: unknown;
  }>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

/**
 * Base repository class for Firestore operations with type safety
 */
export abstract class BaseRepository<T extends { id: string }> {
  protected db: Firestore;
  protected collectionName: string;
  protected schema: z.ZodType<T>;

  constructor(collectionName: string, schema: z.ZodType<T>) {
    this.db = getFirestore();
    this.collectionName = collectionName;
    this.schema = schema;
  }

  /**
   * Convert Firestore document to typed object with validation
   */
  protected docToObject(
    doc: QueryDocumentSnapshot | DocumentSnapshot,
  ): T | null {
    if (!doc.exists) return null;

    const data = doc.data();
    if (!data) return null;

    // Convert Firestore Timestamps to Dates
    const convertedData = { ...data };
    if (
      convertedData.createdAt &&
      typeof convertedData.createdAt.toDate === 'function'
    ) {
      convertedData.createdAt = convertedData.createdAt.toDate();
    }
    if (
      convertedData.updatedAt &&
      typeof convertedData.updatedAt.toDate === 'function'
    ) {
      convertedData.updatedAt = convertedData.updatedAt.toDate();
    }

    const finalData = { id: doc.id, ...convertedData } as T;

    // Validate data with Zod schema
    const result = this.schema.safeParse(finalData);

    if (!result.success) {
      console.error(
        `Validation error for document ${doc.id}:`,
        JSON.stringify(result.error, null, 2),
      );
      // Try to return data anyway if validation fails on timestamps but data is otherwise usable
      return finalData;
    }

    return result.data;
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const docRef = this.db.collection(this.collectionName).doc();

    const now = new Date();
    const documentData = {
      ...data,
      id: docRef.id,
      createdAt: now,
      updatedAt: now,
    } as DocumentData;

    await docRef.set(documentData);

    const doc = await docRef.get();
    const result = this.docToObject(doc);

    if (!result) {
      throw new Error('Failed to create document');
    }

    return result;
  }

  /**
   * Find document by ID
   */
  async findById(id: string): Promise<T | null> {
    const doc = await this.db.collection(this.collectionName).doc(id).get();
    return this.docToObject(doc);
  }

  /**
   * Find all documents with optional query options
   */
  async findAll(options?: QueryOptions): Promise<T[]> {
    let query: Query = this.db.collection(this.collectionName);

    if (options?.where) {
      options.where.forEach(({ field, operator, value }) => {
        query = query.where(field, operator, value);
      });
    }

    if (options?.orderBy) {
      query = query.orderBy(options.orderBy.field, options.orderBy.direction);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const snapshot = await query.get();

    return snapshot.docs
      .map((doc) => this.docToObject(doc))
      .filter((doc): doc is T => doc !== null);
  }

  /**
   * Find documents with pagination
   */
  async findPaginated(
    page = 1,
    limit = 10,
    options?: Omit<QueryOptions, 'limit' | 'offset'>,
  ): Promise<PaginatedResult<T>> {
    const offset = (page - 1) * limit;

    // Get total count
    const totalSnapshot = await this.db
      .collection(this.collectionName)
      .count()
      .get();
    const total = totalSnapshot.data().count;

    // Get paginated data
    const data = await this.findAll({
      ...options,
      limit: limit + 1, // Fetch one extra to check if there are more
      offset,
    });

    const hasMore = data.length > limit;
    const paginatedData = hasMore ? data.slice(0, limit) : data;

    return {
      data: paginatedData,
      total,
      hasMore,
      page,
      limit,
    };
  }

  /**
   * Update document by ID
   */
  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Promise<T | null> {
    const docRef = this.db.collection(this.collectionName).doc(id);

    const updateData = {
      ...data,
      updatedAt: new Date(),
    } as DocumentData;

    await docRef.update(updateData);

    const doc = await docRef.get();
    return this.docToObject(doc);
  }

  /**
   * Delete document by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.db.collection(this.collectionName).doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  /**
   * Check if document exists
   */
  async exists(id: string): Promise<boolean> {
    const doc = await this.db.collection(this.collectionName).doc(id).get();
    return doc.exists;
  }

  /**
   * Count documents with optional filters
   */
  async count(options?: Pick<QueryOptions, 'where'>): Promise<number> {
    let query: Query = this.db.collection(this.collectionName);

    if (options?.where) {
      options.where.forEach(({ field, operator, value }) => {
        query = query.where(field, operator, value);
      });
    }

    const snapshot = await query.count().get();
    return snapshot.data().count;
  }

  /**
   * Batch create multiple documents
   */
  async batchCreate(
    items: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<T[]> {
    const batch = this.db.batch();
    const now = new Date();
    const refs: Array<FirebaseFirestore.DocumentReference> = [];

    items.forEach((item) => {
      const docRef = this.db.collection(this.collectionName).doc();
      const documentData = {
        ...item,
        id: docRef.id,
        createdAt: now,
        updatedAt: now,
      } as DocumentData;

      batch.set(docRef, documentData);
      refs.push(docRef);
    });

    await batch.commit();

    // Fetch and validate created documents
    const createdDocs = await Promise.all(
      refs.map(async (ref) => {
        const doc = await ref.get();
        return this.docToObject(doc);
      }),
    );

    // Filter out null values
    const validDocs: T[] = [];
    for (const doc of createdDocs) {
      if (doc !== null) {
        validDocs.push(doc);
      }
    }

    return validDocs;
  }

  /**
   * Batch delete multiple documents
   */
  async batchDelete(ids: string[]): Promise<boolean> {
    try {
      const batch = this.db.batch();

      ids.forEach((id) => {
        const docRef = this.db.collection(this.collectionName).doc(id);
        batch.delete(docRef);
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error batch deleting documents:', error);
      return false;
    }
  }
}
