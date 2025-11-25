/**
 * Reference Photos Asset Mapping
 *
 * Metro bundler requires all assets to be statically importable.
 * This file maps all reference photos by category (scenario-location).
 *
 * Total: 135 reference photos across 12 categories
 */

export type Scenario = 'portrait-full' | 'portrait-half' | 'close-up';
export type Location = 'outdoors' | 'indoors' | 'restaurant' | 'beach';

interface ReferencePhotos {
  [key: string]: any[];
}

/**
 * Reference photo mapping
 * Structure: referencePhotos['scenario-location'] = [image1, image2, ...]
 */
export const referencePhotos: ReferencePhotos = {
  // Close-up Beach (9 images)
  'close-up-beach': [
    require('@/assets/images/photos/close-up-beach/1.jpg'),
    require('@/assets/images/photos/close-up-beach/2.jpg'),
    require('@/assets/images/photos/close-up-beach/3.jpg'),
    require('@/assets/images/photos/close-up-beach/4.jpg'),
    require('@/assets/images/photos/close-up-beach/5.jpg'),
    require('@/assets/images/photos/close-up-beach/6.jpg'),
    require('@/assets/images/photos/close-up-beach/7.jpg'),
    require('@/assets/images/photos/close-up-beach/8.jpg'),
    require('@/assets/images/photos/close-up-beach/9.jpg'),
  ],

  // Close-up Indoors (9 images)
  'close-up-indoors': [
    require('@/assets/images/photos/close-up-indoors/1.jpg'),
    require('@/assets/images/photos/close-up-indoors/2.jpg'),
    require('@/assets/images/photos/close-up-indoors/3.jpg'),
    require('@/assets/images/photos/close-up-indoors/4.jpg'),
    require('@/assets/images/photos/close-up-indoors/5.jpg'),
    require('@/assets/images/photos/close-up-indoors/6.jpg'),
    require('@/assets/images/photos/close-up-indoors/7.jpg'),
    require('@/assets/images/photos/close-up-indoors/8.jpg'),
    require('@/assets/images/photos/close-up-indoors/9.jpg'),
  ],

  // Close-up Outdoors (9 images)
  'close-up-outdoors': [
    require('@/assets/images/photos/close-up-outdoors/1.jpg'),
    require('@/assets/images/photos/close-up-outdoors/2.jpg'),
    require('@/assets/images/photos/close-up-outdoors/3.jpg'),
    require('@/assets/images/photos/close-up-outdoors/4.jpg'),
    require('@/assets/images/photos/close-up-outdoors/5.jpg'),
    require('@/assets/images/photos/close-up-outdoors/6.jpg'),
    require('@/assets/images/photos/close-up-outdoors/7.jpg'),
    require('@/assets/images/photos/close-up-outdoors/8.jpg'),
    require('@/assets/images/photos/close-up-outdoors/9.jpg'),
  ],

  // Close-up Restaurant (8 images)
  'close-up-restaurant': [
    require('@/assets/images/photos/close-up-restaurant/1.jpg'),
    require('@/assets/images/photos/close-up-restaurant/2.jpg'),
    require('@/assets/images/photos/close-up-restaurant/3.jpg'),
    require('@/assets/images/photos/close-up-restaurant/4.jpg'),
    require('@/assets/images/photos/close-up-restaurant/5.jpg'),
    require('@/assets/images/photos/close-up-restaurant/6.jpg'),
    require('@/assets/images/photos/close-up-restaurant/7.jpg'),
    require('@/assets/images/photos/close-up-restaurant/8.jpg'),
  ],

  // Portrait-Full Beach (19 images)
  'portrait-full-beach': [
    require('@/assets/images/photos/portrait-full-beach/1.jpg'),
    require('@/assets/images/photos/portrait-full-beach/2.jpg'),
    require('@/assets/images/photos/portrait-full-beach/3.jpg'),
    require('@/assets/images/photos/portrait-full-beach/4.jpg'),
    require('@/assets/images/photos/portrait-full-beach/5.jpg'),
    require('@/assets/images/photos/portrait-full-beach/6.jpg'),
    require('@/assets/images/photos/portrait-full-beach/7.jpg'),
    require('@/assets/images/photos/portrait-full-beach/8.jpg'),
    require('@/assets/images/photos/portrait-full-beach/9.jpg'),
    require('@/assets/images/photos/portrait-full-beach/10.jpg'),
    require('@/assets/images/photos/portrait-full-beach/11.jpg'),
    require('@/assets/images/photos/portrait-full-beach/12.jpg'),
    require('@/assets/images/photos/portrait-full-beach/13.jpg'),
    require('@/assets/images/photos/portrait-full-beach/14.jpg'),
    require('@/assets/images/photos/portrait-full-beach/15.jpg'),
    require('@/assets/images/photos/portrait-full-beach/16.jpg'),
    require('@/assets/images/photos/portrait-full-beach/17.jpg'),
    require('@/assets/images/photos/portrait-full-beach/18.jpg'),
    require('@/assets/images/photos/portrait-full-beach/19.jpg'),
  ],

  // Portrait-Full Indoors (19 images)
  'portrait-full-indoors': [
    require('@/assets/images/photos/portrait-full-indoors/1.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/2.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/3.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/4.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/5.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/6.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/7.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/8.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/9.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/10.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/11.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/12.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/13.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/14.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/15.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/16.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/17.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/18.jpg'),
    require('@/assets/images/photos/portrait-full-indoors/19.jpg'),
  ],

  // Portrait-Full Outdoors (10 images)
  'portrait-full-outdoors': [
    require('@/assets/images/photos/portrait-full-outdoors/1.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/2.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/3.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/4.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/5.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/6.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/7.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/8.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/9.jpg'),
    require('@/assets/images/photos/portrait-full-outdoors/10.jpg'),
  ],

  // Portrait-Full Restaurant (11 images)
  'portrait-full-restaurant': [
    require('@/assets/images/photos/portrait-full-restaurant/1.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/2.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/3.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/4.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/5.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/6.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/7.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/8.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/9.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/10.jpg'),
    require('@/assets/images/photos/portrait-full-restaurant/11.jpg'),
  ],

  // Portrait-Half Beach (11 images)
  'portrait-half-beach': [
    require('@/assets/images/photos/portrait-half-beach/1.jpg'),
    require('@/assets/images/photos/portrait-half-beach/2.jpg'),
    require('@/assets/images/photos/portrait-half-beach/3.jpg'),
    require('@/assets/images/photos/portrait-half-beach/4.jpg'),
    require('@/assets/images/photos/portrait-half-beach/5.jpg'),
    require('@/assets/images/photos/portrait-half-beach/6.jpg'),
    require('@/assets/images/photos/portrait-half-beach/7.jpg'),
    require('@/assets/images/photos/portrait-half-beach/8.jpg'),
    require('@/assets/images/photos/portrait-half-beach/9.jpg'),
    require('@/assets/images/photos/portrait-half-beach/10.jpg'),
    require('@/assets/images/photos/portrait-half-beach/11.jpg'),
  ],

  // Portrait-Half Indoors (8 images)
  'portrait-half-indoors': [
    require('@/assets/images/photos/portrait-half-indoors/1.jpg'),
    require('@/assets/images/photos/portrait-half-indoors/2.jpg'),
    require('@/assets/images/photos/portrait-half-indoors/3.jpg'),
    require('@/assets/images/photos/portrait-half-indoors/4.jpg'),
    require('@/assets/images/photos/portrait-half-indoors/5.jpg'),
    require('@/assets/images/photos/portrait-half-indoors/6.jpg'),
    require('@/assets/images/photos/portrait-half-indoors/7.jpg'),
    require('@/assets/images/photos/portrait-half-indoors/8.jpg'),
  ],

  // Portrait-Half Outdoors (8 images)
  'portrait-half-outdoors': [
    require('@/assets/images/photos/portrait-half-outdoors/1.jpg'),
    require('@/assets/images/photos/portrait-half-outdoors/2.jpg'),
    require('@/assets/images/photos/portrait-half-outdoors/3.jpg'),
    require('@/assets/images/photos/portrait-half-outdoors/4.jpg'),
    require('@/assets/images/photos/portrait-half-outdoors/5.jpg'),
    require('@/assets/images/photos/portrait-half-outdoors/6.jpg'),
    require('@/assets/images/photos/portrait-half-outdoors/7.jpg'),
    require('@/assets/images/photos/portrait-half-outdoors/8.jpg'),
  ],

  // Portrait-Half Restaurant (14 images)
  'portrait-half-restaurant': [
    require('@/assets/images/photos/portrait-half-restaurant/1.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/2.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/3.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/4.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/5.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/6.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/7.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/8.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/9.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/10.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/11.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/12.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/13.jpg'),
    require('@/assets/images/photos/portrait-half-restaurant/14.jpg'),
  ],
};

/**
 * Get reference photos for a specific scenario and location
 * @param scenario - The photo scenario ('portrait-full', 'portrait-half', 'close-up')
 * @param location - The location setting ('outdoors', 'indoors', 'restaurant', 'beach')
 * @returns Array of photo assets, or empty array if category not found
 */
export function getReferencePhotos(scenario: string, location: string): any[] {
  const category = `${scenario}-${location}`;
  return referencePhotos[category] || [];
}

/**
 * Get the count of available reference photos for a category
 */
export function getReferenceCount(scenario: string, location: string): number {
  return getReferencePhotos(scenario, location).length;
}

/**
 * Check if a category has reference photos available
 */
export function hasReferencePhotos(scenario: string, location: string): boolean {
  return getReferenceCount(scenario, location) > 0;
}
