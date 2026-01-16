# LumiCore Data Cleaning Frontend

Next.js frontend application for the LumiCore data cleaning challenge. Features real-time data fetching, normalization, inline editing, and submission with visual feedback.

## Features

- **Real-time Data Fetching**: Fetch messy data from backend with retry logic
- **Visual Data Display**: View raw JSON data and cleaned tabular data
- **Inline Editing**: Edit any field directly in the table
- **Visual Validation**: Green/red highlighting for valid/invalid fields
- **Error Handling**: Automatic retries with exponential backoff
- **Loading States**: Clear feedback during async operations
- **Score Display**: Real-time score feedback after submission
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

For production, set this to your deployed backend URL.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── DataTable.tsx       # Editable data table
│   │   ├── RawDataDisplay.tsx  # Raw JSON viewer
│   │   └── LoadingSpinner.tsx  # Loading indicator
│   ├── lib/
│   │   └── api.ts              # API client
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── globals.css             # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Usage Guide

### Step 1: Fetch Data
1. Enter your name in the "Candidate Name" field
2. Click "Fetch Data" button
3. Wait for data to load (automatic retries on failure)
4. Batch ID will be populated automatically

### Step 2: Normalize Data
1. Click "Normalize Data" button
2. Backend will clean and standardize the data
3. Cleaned data appears in editable table

### Step 3: Review & Edit
1. Review the cleaned data in the table
2. Green fields = valid, Red fields = need attention
3. Click any field to edit inline
4. All changes are saved automatically

### Step 4: Submit
1. Click "Submit Data" button
2. Data is sent to LumiCore API
3. Score is displayed (goal: 100/100)

## Components

### DataTable
Displays cleaned data in an editable table with validation feedback.

**Props:**
- `data`: Array of cleaned documents
- `onEdit`: Callback for field edits
- `title`: Table title

**Features:**
- Inline editing for all fields
- Visual validation (green/red borders)
- Type-aware input handling

### RawDataDisplay
Shows raw JSON data from the API in a code block.

**Props:**
- `data`: Array of raw documents

**Features:**
- Syntax-highlighted JSON
- Scrollable container
- Dark theme for readability

### LoadingSpinner
Animated loading indicator.

**Features:**
- Smooth spin animation
- Centered display
- Accessible

## API Integration

### Endpoints Used

1. **Fetch Data**
   ```typescript
   GET /api/fetch/?batch=1
   ```

2. **Normalize Data**
   ```typescript
   POST /api/normalize/
   Body: { raw_data: [...] }
   ```

3. **Submit Data**
   ```typescript
   POST /api/submit/
   Body: {
     candidate_name: string,
     batch_id: string,
     cleaned_items: [...]
   }
   ```

## TanStack Query Configuration

### Fetch Query
- **Retry**: 3 attempts
- **Retry Delay**: Exponential backoff (1s, 2s, 4s)
- **Timeout**: 30 seconds
- **Manual Trigger**: Disabled by default

### Mutations
- **Normalize**: Transforms raw data to cleaned format
- **Submit**: Sends cleaned data and receives score

## Validation Rules

### Field Validation
- **doc_id**: Must be non-empty string
- **type**: Must be non-empty string
- **counterparty**: Must be non-empty string
- **project**: Must be non-empty string
- **expiry_date**: Must match YYYY-MM-DD format
- **amount**: Must be positive number

### Visual Feedback
- ✅ Green border + green background = Valid
- ❌ Red border + red background = Invalid

## Deployment to Vercel

### Option 1: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Set environment variable:
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend URL
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and set environment variables when asked.

### Environment Variables

In Vercel dashboard, add:
- **Key**: `NEXT_PUBLIC_BACKEND_URL`
- **Value**: `https://your-backend-url.com`

## Styling

### Tailwind CSS Classes Used

- **Layout**: `flex`, `grid`, `container`, `mx-auto`
- **Spacing**: `p-*`, `m-*`, `gap-*`
- **Colors**: `bg-*`, `text-*`, `border-*`
- **Effects**: `shadow-*`, `rounded-*`, `hover:*`
- **Responsive**: `md:*`, `lg:*`

### Color Scheme

- **Primary**: Blue (`blue-600`)
- **Success**: Green (`green-600`)
- **Warning**: Yellow (`yellow-600`)
- **Error**: Red (`red-600`)
- **Neutral**: Gray (`gray-*`)

## Error Handling

### Network Errors
- Automatic retry with exponential backoff
- Visual error messages
- Retry count display

### Validation Errors
- Real-time field validation
- Visual feedback (red borders)
- Prevents submission of invalid data

### API Errors
- User-friendly error messages
- Retry buttons
- Status code handling

## Performance Optimizations

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Caching**: TanStack Query cache
- **Lazy Loading**: Components loaded on demand

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Issue: Backend connection failed
**Solution**: Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`

### Issue: Data not loading
**Solution**: Ensure backend is running and accessible

### Issue: Validation errors
**Solution**: Check date format (YYYY-MM-DD) and amount is a number

### Issue: Build errors
**Solution**: Run `npm install` to ensure all dependencies are installed

## Development Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **TypeScript**: Use types for better IDE support
3. **Console**: Check browser console for errors
4. **Network Tab**: Monitor API calls in DevTools

## Testing Locally

1. Start backend: `python manage.py runserver`
2. Start frontend: `npm run dev`
3. Open `http://localhost:3000`
4. Test full workflow

## License

MIT
