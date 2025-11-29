import { Adhkar, AdhkarType } from '@/types/adhkar.types';

// Import the JSON file
const adhkarData: Adhkar[] = require('@/assets/data/adhkar-en.json');

class AdhkarService {
  private allAdhkar: Adhkar[] = [];

  constructor() {
    this.loadAdhkar();
  }

  /**
   * Load adhkar data from the JSON file
   */
  private loadAdhkar(): void {
    try {
      this.allAdhkar = adhkarData;
    } catch (error) {
      console.error('Error loading adhkar data:', error);
      this.allAdhkar = [];
    }
  }

  /**
   * Get all adhkar
   */
  getAllAdhkar(): Adhkar[] {
    return this.allAdhkar;
  }

  /**
   * Get morning adhkar (type 0 or 1)
   */
  getMorningAdhkar(): Adhkar[] {
    return this.allAdhkar
      .filter(item => item.type === AdhkarType.Both || item.type === AdhkarType.Morning)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get evening adhkar (type 0 or 2)
   */
  getEveningAdhkar(): Adhkar[] {
    return this.allAdhkar
      .filter(item => item.type === AdhkarType.Both || item.type === AdhkarType.Evening)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get adhkar by category
   */
  getAdhkarByCategory(category: 'morning' | 'evening'): Adhkar[] {
    return category === 'morning' ? this.getMorningAdhkar() : this.getEveningAdhkar();
  }

  /**
   * Get total count for a category
   */
  getTotalCount(category: 'morning' | 'evening'): number {
    const adhkarList = this.getAdhkarByCategory(category);
    return adhkarList.reduce((total, item) => total + item.count, 0);
  }

  /**
   * Get adhkar by order
   */
  getAdhkarByOrder(order: number): Adhkar | undefined {
    return this.allAdhkar.find(item => item.order === order);
  }
}

// Export singleton instance
export const adhkarService = new AdhkarService();