# Seed Dishes Script

This script creates 30 dishes for a specific caterer with realistic food data and Unsplash images.

## Usage

### Option 1: Using Environment Variable (Recommended)

```bash
CATERER_ID=your-caterer-id-here npm run seed:dishes
```

### Option 2: Edit the Script Directly

1. Open `src/scripts/seed-dishes.ts`
2. Find the line: `const CATERER_ID = process.env.CATERER_ID || "YOUR_CATERER_ID_HERE";`
3. Replace `"YOUR_CATERER_ID_HERE"` with your actual caterer ID
4. Run: `npm run seed:dishes`

## Prerequisites

1. **Database must be set up** - Make sure your database is running and migrations are applied
2. **Seed data must exist** - Run `npm run seed` first to create:
   - Cuisine Types (Indian, Arabic, Western, Chinese, Italian, Mediterranean)
   - Categories (Appetizers, Main Course, Desserts, Salads, etc.)
   - SubCategories (Curry, Grilled, Pasta, etc.)

## What the Script Does

1. ✅ Verifies the caterer ID exists and is a CATERER type
2. ✅ Fetches existing cuisine types, categories, and subcategories
3. ✅ Creates 30 dishes with:
   - Realistic food names
   - Unsplash food images
   - Proper categorization
   - Realistic prices (AED)
   - Quantity in grams or pieces
   - All dishes set as active

## Dish Categories Included

- **Indian**: Butter Chicken, Biryani, Samosa, etc.
- **Arabic**: Shawarma, Hummus, Baklava, etc.
- **Western**: Caesar Salad, Grilled Chicken, Chocolate Cake, etc.
- **Chinese**: Spring Rolls, Fried Rice, Sweet & Sour Chicken, etc.
- **Italian**: Bruschetta, Spaghetti, Tiramisu, Pizza, etc.
- **Mediterranean**: Greek Salad, Grilled Salmon, etc.

## Example Output

```
🌱 Starting dish seeding script...
📝 Using Caterer ID: 4ac7c950-4383-4ca2-9262-15e33dcd0b3f
✅ Found caterer: chinmay badwaik (Techmonkey)
📋 Fetching existing cuisine types, categories, and subcategories...
   Found 6 cuisine types, 6 categories, 10 subcategories
🍽️  Creating dishes...
   ✓ Created: Butter Chicken (45 AED)
   ✓ Created: Chicken Biryani (38 AED)
   ...

✅ Dish seeding completed!
📊 Summary:
   - Total dishes created: 30
   - Caterer: Techmonkey
```

## Troubleshooting

**Error: Caterer not found**
- Make sure the caterer ID is correct
- Verify the caterer exists in the database

**Error: No cuisine types/categories found**
- Run `npm run seed` first to create the base data

**Error: Missing required IDs**
- Some dishes might be skipped if the required cuisine/category/subcategory doesn't exist
- Check the seed.ts file to see what's available


