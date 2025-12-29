# Size and Quantity Extraction from Product Images

## Overview

The app now automatically extracts **size** and **quantity** information from product images and labels using Google Cloud Vision API text detection and intelligent pattern matching.

## Features

### Size Detection

Automatically recognizes and extracts product sizes in various formats:

**Volume:**
- Fluid ounces: `12 oz`, `12 fl oz`, `12 ounce`
- Milliliters: `500ml`, `500 milliliter`
- Liters: `2L`, `2 liter`
- Gallons: `1 gal`, `1 gallon`
- Pints: `1 pt`, `1 pint`
- Quarts: `32 qt`, `32 quart`

**Weight:**
- Pounds: `5 lb`, `5 pound`
- Kilograms: `2.5 kg`, `2.5 kilogram`
- Grams: `500g`, `500 gram`
- Milligrams: `100mg`, `100 milligram`

**Count:**
- `50 ct`, `50 count`
- `24 pack`, `24 pk`

### Quantity Detection

Automatically recognizes package quantities:

**Pack Patterns:**
- `6 pack`, `12 pk`, `pack of 24`

**Count Patterns:**
- `12 count`, `24 ct`, `6 piece`

**Case Patterns:**
- `case of 12`, `24 case`

**Box Patterns:**
- `box of 6`, `12 box`

**General Patterns:**
- `6×`, `12x`, `6/`, `per 12`

## How It Works

### 1. Barcode Scanning

When you scan a product barcode, the app:
1. Fetches product data from Open Food Facts API
2. Extracts size from the `quantity` field (e.g., "355 ml")
3. Parses quantity patterns from the product name
4. Auto-fills the size and quantity fields

### 2. Image Recognition

When you take a picture of a product, the app:
1. Sends the image to Google Cloud Vision API
2. Detects all text on the label
3. Runs pattern matching to find size and quantity
4. Auto-fills the detected values
5. Logs results to console with 📏 and 🔢 emojis

## Example Scenarios

### Beverage Can
**Product Label:** "Coca-Cola 12 fl oz 6 pack"
- **Detected Size:** `12 fl oz`
- **Detected Quantity:** `6`
- **Auto-filled:** Title, size in notes, quantity field

### Snack Pack
**Product Label:** "Lay's Chips 1 oz 24 count"
- **Detected Size:** `1 oz`
- **Detected Quantity:** `24`

### Milk Jug
**Product Label:** "Whole Milk 1 gallon"
- **Detected Size:** `1 gallon`
- **Detected Quantity:** (none - single item)

### Metric Product
**Product Label:** "Spring Water 500ml pack of 24"
- **Detected Size:** `500ml`
- **Detected Quantity:** `24`

## User Experience

### Before Detection
```
Title: [Empty]
Note: [Empty]
Quantity: 1
```

### After Detection
```
Title: Coca-Cola
Note: Brand: Coca-Cola
      Size: 12 fl oz
      Refreshing cola beverage
Quantity: 6
```

### Product Found Alert
```
┌──────────────────────────────────┐
│    Product Found!                │
├──────────────────────────────────┤
│ Coca-Cola - 12 fl oz             │
│ Quantity: 6                      │
│                                  │
│ Available at:                    │
│ Walmart (1.2mi) - $5.99         │
│ Target (1.5mi) - $6.49          │
│ Kroger (2.1mi) - $5.79          │
└──────────────────────────────────┘
```

## Technical Details

### Pattern Matching

**Size Extraction Function:**
```typescript
function extractSizeFromText(text: string): string | undefined
```

Uses regex patterns to match:
- Volume with decimal support: `\d+\.?\d*\s*(oz|ml|L|gal|pt|qt)`
- Weight with decimal support: `\d+\.?\d*\s*(lb|kg|g|mg)`
- Count: `\d+\s*(ct|pack|pk|count)`

**Quantity Extraction Function:**
```typescript
function extractQuantityFromText(text: string): number | undefined
```

Uses regex patterns to match:
- Pack formats: `(\d+)\s*pack`, `pack\s*of\s*(\d+)`
- Count formats: `(\d+)\s*count`, `(\d+)\s*ct`
- Case formats: `case\s*of\s*(\d+)`, `(\d+)\s*case`
- General formats: `(\d+)\s*[x×/]`, `per\s*(\d+)`

### Integration Points

**Modified Files:**
1. [src/services/productRecognition.ts](src/services/productRecognition.ts)
   - Added `extractSizeFromText()`
   - Added `extractQuantityFromText()`
   - Updated `ProductInfo` interface with `size?` and `quantity?`
   - Integrated extraction into `recognizeProductFromBarcode()`
   - Integrated extraction into `recognizeProductFromImage()`

2. [App.tsx](App.tsx)
   - Auto-fill quantity field from detected quantity
   - Display size and quantity in product found alerts
   - Include size in product notes

## Console Logging

When size or quantity is detected, you'll see console logs:

```
📏 Size detected: 12 fl oz
🔢 Quantity detected: 6
```

## Testing

### Test with Real Products

1. **Single Item:**
   - Take picture of: "Tide Pods 50 count"
   - Expected: size="50 count" or quantity=50

2. **Multi-Pack:**
   - Take picture of: "Coca-Cola 12 oz 6 pack"
   - Expected: size="12 oz", quantity=6

3. **Large Format:**
   - Take picture of: "Milk 1 gallon"
   - Expected: size="1 gallon"

4. **Metric:**
   - Take picture of: "Water 500ml 24 pack"
   - Expected: size="500ml", quantity=24

### Verification Steps

1. Launch the app
2. Create a new task
3. Tap "SCAN SKU" or "TAKE PICTURE"
4. Point at product label showing size/quantity
5. Verify extracted values appear in:
   - Title (product name)
   - Note (size included)
   - Quantity field (auto-filled)
6. Check console for 📏 and 🔢 emoji logs

## Known Limitations

1. **Text Detection Required:** Product label must be clearly visible and readable
2. **Pattern Matching:** Only recognizes standard size/quantity formats
3. **Language Support:** Currently optimized for English labels
4. **First Match Only:** If multiple sizes appear, extracts the first one
5. **Vision API Required:** Needs Google Cloud Vision API key configured

## Future Enhancements

- Multi-language support (Spanish, French, etc.)
- Custom size/quantity patterns for specific stores
- Machine learning to improve pattern recognition
- Support for fractional quantities (e.g., "½ gallon")
- Regional format support (European vs. US measurements)

## Commit

**Commit:** `a2c2515`
**Date:** December 26, 2024
**Branch:** `ellio-ios-xcode-15.4`

**Changes:**
- Added `extractSizeFromText()` with 15+ patterns
- Added `extractQuantityFromText()` with 10+ patterns  
- Updated `ProductInfo` interface
- Integrated extraction into barcode and image recognition
- Auto-fill quantity field when detected
- Display size and quantity in alerts
- Console logging with emoji indicators
