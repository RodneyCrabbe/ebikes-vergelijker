# N8N Webhook Setup Guide

This guide explains how to set up the N8N automation webhook to receive appointment data from the E-Bike Platform.

## 📋 Overview

When a customer books an appointment through the website, the system automatically sends all appointment details to an N8N webhook. This allows you to:

- Send confirmation emails automatically
- Store appointment data in Google Drive
- Notify dealers via email/SMS
- Track appointments in Google Sheets
- Send reminders 24h before appointments

## 🚀 Quick Start

### 1. Configure the Webhook URL

Edit your `.env` file and add your N8N webhook URL:

```env
VITE_N8N_APPOINTMENT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/appointment
```

**Important:** Replace `https://your-n8n-instance.com/webhook/appointment` with your actual N8N webhook URL.

### 2. Restart the Development Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

## 📤 Webhook Payload Structure

When an appointment is created, the following JSON payload is sent to your N8N webhook:

```json
{
  // Appointment Details
  "appointment_id": "550e8400-e29b-41d4-a716-446655440001",
  "appointment_type": "test_drive",
  "appointment_date": "2025-10-15",
  "appointment_time": "14:30",
  "appointment_duration": 60,
  "status": "pending",
  "notes": "Optional customer notes...",

  // Customer Information
  "customer": {
    "first_name": "Jan",
    "last_name": "de Vries",
    "full_name": "Jan de Vries",
    "email": "jan.devries@example.com",
    "phone": "06-12345678"
  },

  // E-Bike Information (if applicable)
  "ebike": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "brand": "Aventon",
    "model_name": "Level.2",
    "price": 1499.00,
    "image_url": "https://example.com/image.jpg"
  },

  // Dealer/Location Information
  "dealer": {
    "id": "dealer-001",
    "name": "E-Bike Center Amsterdam",
    "address": "Hoofdstraat 123",
    "city": "Amsterdam",
    "postal_code": "1011 AB",
    "phone": "020-1234567",
    "email": "info@ebikecenter.nl",
    "coordinates": {
      "lat": 52.3676,
      "lng": 4.9041
    }
  },

  // Formatted Fields (ready for emails/notifications)
  "created_at": "2025-10-12T10:30:00.000Z",
  "formatted_date": "vrijdag 15 oktober 2025",
  "formatted_time": "14:30",
  "appointment_type_label": "Proefrit"
}
```

## 🔧 N8N Workflow Setup

### Step 1: Create Webhook Node

1. Open your N8N instance
2. Create a new workflow
3. Add a **Webhook** node
4. Configure the webhook:
   - **HTTP Method:** POST
   - **Path:** `/appointment` (or your preferred path)
   - **Response Code:** 200
   - **Response Data:** `{"success": true, "message": "Appointment received"}`

5. Save and activate the webhook
6. Copy the webhook URL (e.g., `https://your-n8n-instance.com/webhook/appointment`)

### Step 2: Add Email Notification Node

Add a **Send Email** node to send confirmation emails:

```javascript
// Email Subject
Bevestiging Afspraak - {{ $json.appointment_type_label }}

// Email Body (HTML)
<h2>Beste {{ $json.customer.first_name }},</h2>

<p>Je afspraak is bevestigd!</p>

<h3>Afspraakdetails:</h3>
<ul>
  <li><strong>Type:</strong> {{ $json.appointment_type_label }}</li>
  <li><strong>Datum:</strong> {{ $json.formatted_date }}</li>
  <li><strong>Tijd:</strong> {{ $json.formatted_time }}</li>
  <li><strong>Duur:</strong> {{ $json.appointment_duration }} minuten</li>
</ul>

<h3>Locatie:</h3>
<p>
  {{ $json.dealer.name }}<br>
  {{ $json.dealer.address }}<br>
  {{ $json.dealer.postal_code }} {{ $json.dealer.city }}<br>
  Tel: {{ $json.dealer.phone }}
</p>

{{ $json.ebike ? `
<h3>E-Bike:</h3>
<p>{{ $json.ebike.brand }} {{ $json.ebike.model_name }} (€{{ $json.ebike.price }})</p>
` : '' }}

{{ $json.notes ? `
<h3>Jouw opmerkingen:</h3>
<p>{{ $json.notes }}</p>
` : '' }}

<p>Heb je vragen? Neem contact op met {{ $json.dealer.email }} of {{ $json.dealer.phone }}</p>

<p>Met vriendelijke groet,<br>E-Bike Vergelijker</p>
```

### Step 3: Add Google Drive Node (Optional)

Add a **Google Drive** node to save appointment data:

1. Create a folder in Google Drive (e.g., "Appointments")
2. Add **Google Drive** node
3. **Operation:** Upload a File
4. **File Content:** JSON data from webhook
5. **File Name:** `appointment-{{ $json.appointment_id }}.json`
6. **Parent Folder ID:** Your Google Drive folder ID

### Step 4: Add Google Sheets Node (Optional)

Log appointments to Google Sheets:

1. Create a Google Sheet with columns:
   - Date
   - Time
   - Customer Name
   - Email
   - Phone
   - Appointment Type
   - Dealer
   - E-Bike
   - Status

2. Add **Google Sheets** node
3. **Operation:** Append Row
4. **Spreadsheet ID:** Your spreadsheet ID
5. Map the fields from the webhook payload

### Step 5: Add Dealer Notification Email

Send notification to the dealer:

```javascript
// To: {{ $json.dealer.email }}
// Subject: Nieuwe Afspraak - {{ $json.formatted_date }} om {{ $json.formatted_time }}

// Email Body
<h2>Nieuwe Afspraak</h2>

<h3>Klantgegevens:</h3>
<ul>
  <li><strong>Naam:</strong> {{ $json.customer.full_name }}</li>
  <li><strong>Email:</strong> {{ $json.customer.email }}</li>
  <li><strong>Telefoon:</strong> {{ $json.customer.phone }}</li>
</ul>

<h3>Afspraakdetails:</h3>
<ul>
  <li><strong>Type:</strong> {{ $json.appointment_type_label }}</li>
  <li><strong>Datum:</strong> {{ $json.formatted_date }}</li>
  <li><strong>Tijd:</strong> {{ $json.formatted_time }}</li>
  <li><strong>Duur:</strong> {{ $json.appointment_duration }} minuten</li>
</ul>

{{ $json.ebike ? `
<h3>E-Bike:</h3>
<p>{{ $json.ebike.brand }} {{ $json.ebike.model_name }}</p>
` : '' }}

{{ $json.notes ? `
<h3>Opmerkingen van klant:</h3>
<p>{{ $json.notes }}</p>
` : '' }}
```

## 🧪 Testing the Webhook

### Test from N8N

1. In N8N, click on the Webhook node
2. Click "Execute Node"
3. The webhook URL will be displayed
4. Use a tool like Postman or curl to test:

```bash
curl -X POST https://your-n8n-instance.com/webhook/appointment \
  -H "Content-Type: application/json" \
  -d '{
    "test": true,
    "message": "Test connection from E-Bike Platform",
    "timestamp": "2025-10-12T10:30:00.000Z"
  }'
```

### Test from the Application

1. Go to http://127.0.0.1:5174/afspraak
2. Fill in the appointment form
3. Click "Afspraak Bevestigen"
4. Check your N8N workflow execution history
5. Verify the email was sent and data was saved

## 📧 Email Service Configuration

### Using Gmail

1. In N8N, add **Gmail** node instead of generic "Send Email"
2. Authenticate with your Gmail account
3. Configure OAuth2 permissions

### Using SendGrid/Mailgun

1. Add the respective email service node
2. Add your API keys in N8N credentials
3. Configure the sender email and templates

## 🔐 Security Best Practices

1. **Webhook Authentication:** Add authentication to your N8N webhook
   ```javascript
   // In N8N Webhook node, add authentication header check
   if ($headers.authorization !== 'Bearer YOUR_SECRET_TOKEN') {
     return {
       statusCode: 401,
       body: { error: 'Unauthorized' }
     };
   }
   ```

2. **Rate Limiting:** Enable rate limiting in N8N to prevent abuse

3. **HTTPS Only:** Ensure your N8N instance uses HTTPS

4. **Environment Variables:** Never hardcode sensitive data

## 🐛 Troubleshooting

### Webhook Not Receiving Data

1. Check if the webhook URL is correct in `.env`
2. Verify N8N workflow is activated
3. Check N8N execution history for errors
4. Look at browser console for errors

### Email Not Sending

1. Verify email node configuration in N8N
2. Check email service API keys/credentials
3. Look at N8N execution logs for email errors

### Data Not Saving to Google Drive/Sheets

1. Verify Google API permissions in N8N
2. Check if the folder/spreadsheet ID is correct
3. Ensure the Google account has write access

## 📊 Example N8N Workflow

Here's a complete example workflow:

```
[Webhook: /appointment]
    ↓
[Function: Validate Data]
    ↓
[Branch]
    ├─→ [Send Email to Customer]
    ├─→ [Send Email to Dealer]
    ├─→ [Save to Google Drive]
    ├─→ [Append to Google Sheets]
    └─→ [Schedule Reminder (24h before)]
```

## 🎯 Advanced Features

### 1. Automatic Reminders

Add a **Schedule** node to send reminders 24 hours before:

```javascript
// Check if appointment is tomorrow
const appointmentDate = new Date($json.appointment_date);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

if (appointmentDate.toDateString() === tomorrow.toDateString()) {
  // Send reminder email
  return $json;
}
```

### 2. SMS Notifications

Add a **Twilio** node to send SMS notifications:

```
Hallo {{ $json.customer.first_name }}, dit is een herinnering voor je afspraak morgen om {{ $json.formatted_time }} bij {{ $json.dealer.name }}. Tot snel!
```

### 3. Calendar Integration

Add appointments to Google Calendar:

1. Add **Google Calendar** node
2. **Operation:** Create Event
3. Map appointment data to calendar event

## 📝 Notes

- The webhook is called automatically when a customer books an appointment
- If the webhook fails, the appointment is still saved in the database
- Check browser console for webhook status
- N8N workflow logs provide detailed debugging information

## 🔗 Resources

- [N8N Documentation](https://docs.n8n.io/)
- [N8N Webhook Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Google Drive API](https://developers.google.com/drive/api/v3/about-sdk)
- [SendGrid API](https://docs.sendgrid.com/)

## 💡 Support

If you need help:
1. Check N8N execution history for errors
2. Review browser console for webhook calls
3. Verify all environment variables are set correctly
4. Test with a simple curl command first
