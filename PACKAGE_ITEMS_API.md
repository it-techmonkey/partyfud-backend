# Package Items API Documentation

## Overview

The Package Items API allows you to create and manage package items independently before linking them to a package. This enables a workflow where:

1. **Create Package Items** - Add dishes to a package with quantity, people count, and price
2. **Store in DB** - Items are saved immediately, even if package is discarded
3. **Link to Package** - When ready, link multiple items to create a complete package

## Schema Changes

The `PackageItem` model now has `package_id` as nullable, allowing items to exist without being linked to a package:

```prisma
model PackageItem {
  package_id    String?   // Made nullable - items can exist independently
  ...
}
```

**⚠️ Migration Required:** Run `npx prisma migrate dev` to apply this schema change.

## API Endpoints

### 1. Create Package Item
**POST** `/api/caterer/packages/items`

Create a new package item (can exist without a package).

**Request Body:**
```json
{
  "dish_id": "uuid",
  "people_count": 10,
  "quantity": 5,
  "price_at_time": 45.00,
  "is_optional": false,
  "is_addon": false,
  "package_id": "uuid" // Optional - can be null for draft items
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "dish_id": "uuid",
    "people_count": 10,
    "quantity": 5,
    "price_at_time": 45.00,
    "is_optional": false,
    "is_addon": false,
    "package_id": null,
    "dish": { ... },
    "package": null
  }
}
```

### 2. Get All Package Items
**GET** `/api/caterer/packages/items?package_id=xxx`

Get all package items for the caterer. Optionally filter by package_id.

**Query Parameters:**
- `package_id` (optional) - Filter items by package

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "dish_id": "uuid",
      "people_count": 10,
      "quantity": 5,
      "price_at_time": 45.00,
      "dish": { ... },
      "package": { ... }
    }
  ]
}
```

### 3. Get Package Item by ID
**GET** `/api/caterer/packages/items/:id`

Get a specific package item.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "dish_id": "uuid",
    "people_count": 10,
    "quantity": 5,
    "price_at_time": 45.00,
    "dish": { ... },
    "package": { ... }
  }
}
```

### 4. Update Package Item
**PUT** `/api/caterer/packages/items/:id`

Update a package item.

**Request Body:**
```json
{
  "dish_id": "uuid",
  "people_count": 15,
  "quantity": 8,
  "price_at_time": 50.00,
  "is_optional": true,
  "is_addon": false,
  "package_id": "uuid" // Optional
}
```

### 5. Delete Package Item
**DELETE** `/api/caterer/packages/items/:id`

Delete a package item.

**Response:**
```json
{
  "success": true,
  "message": "Package item deleted successfully"
}
```

### 6. Link Package Items to Package
**POST** `/api/caterer/packages/:id/items/link`

Link multiple package items to a package.

**Request Body:**
```json
{
  "item_ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid1", "package_id": "package-uuid", ... },
    { "id": "uuid2", "package_id": "package-uuid", ... },
    { "id": "uuid3", "package_id": "package-uuid", ... }
  ],
  "message": "Package items linked successfully"
}
```

### 7. Create Package (Enhanced)
**POST** `/api/caterer/packages`

Create a package and optionally link package items.

**Request Body (FormData):**
```
name: "Wedding Package"
people_count: 100
package_type_id: "uuid"
total_price: 5000.00
currency: "AED"
package_item_ids: ["uuid1", "uuid2", "uuid3"] // Optional - array of item IDs
cover_image: [file] // Optional
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Wedding Package",
    "people_count": 100,
    "items": [
      { "id": "uuid1", ... },
      { "id": "uuid2", ... },
      { "id": "uuid3", ... }
    ],
    ...
  }
}
```

## Frontend Workflow

### Step 1: Create Package Items
```javascript
// User adds a dish to package
const response = await fetch('/api/caterer/packages/items', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    dish_id: 'dish-uuid',
    people_count: 10,
    quantity: 5,
    price_at_time: 45.00
  })
});

const item = await response.json();
// Item is saved in DB with package_id = null
```

### Step 2: Add More Items
```javascript
// User adds more dishes
// Each item is saved independently
const items = [item1, item2, item3]; // All have package_id = null
```

### Step 3: Create Package with Items
```javascript
// User clicks "Save Package"
const formData = new FormData();
formData.append('name', 'Wedding Package');
formData.append('people_count', '100');
formData.append('package_type_id', 'type-uuid');
formData.append('total_price', '5000.00');
formData.append('package_item_ids[]', item1.id);
formData.append('package_item_ids[]', item2.id);
formData.append('package_item_ids[]', item3.id);

const response = await fetch('/api/caterer/packages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

// Package is created and items are linked
```

### Alternative: Link Items Later
```javascript
// Create package first
const package = await createPackage({ ... });

// Link items later
await fetch(`/api/caterer/packages/${package.id}/items/link`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    item_ids: [item1.id, item2.id, item3.id]
  })
});
```

## Key Features

1. **Independent Items** - Package items can exist without a package (`package_id = null`)
2. **Persistent Storage** - Items are saved in DB even if package is discarded
3. **Flexible Linking** - Link items when creating package or link them later
4. **Type Safety** - FormData values are automatically converted to proper types
5. **Validation** - All operations verify ownership (items must belong to caterer's dishes)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

Common errors:
- `404` - Resource not found
- `400` - Validation error or bad request
- `403` - Permission denied (item doesn't belong to caterer)

## Notes

- Package items are tied to dishes, which must belong to the caterer
- When linking items, all items must belong to the caterer
- Items can be moved between packages by updating `package_id`
- Deleting a package will cascade delete its items (if `onDelete: Cascade` is set)

