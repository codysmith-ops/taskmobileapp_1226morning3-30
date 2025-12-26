#!/bin/bash

# Enable ALL Google Cloud APIs for Mobile Todo List
# Project: mobile-todo-20251226
# Your $300 credit covers all of these!

PROJECT_ID="mobile-todo-20251226"

echo "🚀 Enabling Google Cloud APIs for $PROJECT_ID"
echo "================================================"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

echo "✅ Enabling Core APIs..."

# Already enabled
echo "  1. Cloud Vision API (Receipt OCR, Barcode scanning)"
gcloud services enable vision.googleapis.com

echo "  2. Places API (Store discovery, hours, ratings)"
gcloud services enable places-backend.googleapis.com

echo "  3. Maps JavaScript API (Map displays)"
gcloud services enable maps-backend.googleapis.com

echo ""
echo "✅ Enabling Navigation & Location APIs..."

echo "  4. Directions API (Route optimization)"
gcloud services enable directions-backend.googleapis.com

echo "  5. Distance Matrix API (Travel time calculations)"
gcloud services enable distance-matrix-backend.googleapis.com

echo "  6. Geocoding API (Address lookups)"
gcloud services enable geocoding-backend.googleapis.com

echo "  7. Geolocation API (Device location)"
gcloud services enable geolocation.googleapis.com

echo ""
echo "✅ Enabling AI/ML APIs..."

echo "  8. Cloud Natural Language API (Smart text analysis)"
gcloud services enable language.googleapis.com

echo "  9. Cloud Translation API (Multi-language support)"
gcloud services enable translate.googleapis.com

echo "  10. Speech-to-Text API (Voice input)"
gcloud services enable speech.googleapis.com

echo "  11. Text-to-Speech API (Voice output)"
gcloud services enable texttospeech.googleapis.com

echo ""
echo "✅ Enabling Additional Features..."

echo "  12. Cloud Storage API (Image storage)"
gcloud services enable storage-api.googleapis.com

echo "  13. Cloud Functions API (Serverless backend)"
gcloud services enable cloudfunctions.googleapis.com

echo "  14. Cloud Firestore API (Database)"
gcloud services enable firestore.googleapis.com

echo "  15. Firebase Rules API (Security)"
gcloud services enable firebaserules.googleapis.com

echo ""
echo "================================================"
echo "✅ ALL APIS ENABLED!"
echo "================================================"
echo ""
echo "📊 Cost Estimate with $300 credit:"
echo "   - Places API: ~$17 per 1000 requests"
echo "   - Vision API: ~$1.50 per 1000 images"
echo "   - Directions: ~$5 per 1000 requests"
echo "   - Translation: ~$20 per 1M characters"
echo "   - Speech-to-Text: ~$2.40 per hour"
echo ""
echo "💰 Your $300 credit = roughly:"
echo "   - 17,000+ store searches"
echo "   - 200,000+ receipt scans"
echo "   - 60,000+ route optimizations"
echo "   - 15M translated characters"
echo "   - 125 hours of voice transcription"
echo ""
echo "🎯 Next Steps:"
echo "   1. APIs are now active"
echo "   2. Your API key is already in .env"
echo "   3. Launch your app - it's ready!"
echo ""
