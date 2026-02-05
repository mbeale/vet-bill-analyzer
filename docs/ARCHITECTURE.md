# Architecture

## 1. System Overview

PetCare AI is a serverless, event-driven web application. It uses a Linear Pipeline Architecture for data extraction and a Geospatial Relational Model for price benchmarking.

## 2. Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage (S3-compatible)
- **AI/ML Pipeline**:
  - **Extraction**: Google Document AI (Expense Processor)
  - **Reasoning/Mapping**: Gemini 2.0 Flash
- **Deployment**: Vercel

## 3. Data Flow Architecture

### Step 1: Ingestion & Storage

- Client-side upload to Supabase Storage.
- Trigger a Vercel Edge Function on upload completion.
- Store initial receipt_metadata (user_id, status: 'processing').

### Step 2: The Extraction Pipeline (The "Black Box")

This system uses a tiered approach to handle the high variance in vet receipts:

- **Google Document AI**: Extracts raw text and basic entities (Total, Tax, Merchant Name).
- **Gemini Interpreter**:
  - **Input**: Raw OCR text + Geographic Context.
  - **Task**: Map line items to the standardized_procedures table.
  - **Output**: Structured JSON following a strict Pydantic schema.

### Step 3: Benchmarking & Verdict

- Query PostgreSQL using ST_DWithin (PostGIS) to find the median price of mapped procedures within a 10-25 mile radius of the clinic's zip code.
- Calculate the Z-score of the user's bill against the regional dataset.
- Write final verdict to the database and trigger a Push/Webhook notification to the frontend.

## 4. Logical Data Model

We maintain a separation between User Data (Private) and Benchmark Data (Aggregated/Anonymized).

- **users**: Profiles and subscription tiers ($5/mo gate).
- **receipts**: Child of users; stores the raw extraction and the final verdict score.
- **line_items**: Individual charges from receipts, linked to procedure_definitions.
- **regional_aggregates**: A materialized view refreshed every 24 hours that calculates medians per Zip3/Zip5. This ensures the "Verdict" query is sub-millisecond.

## 5. Security & Privacy

- **RLS (Row Level Security)**: Strictly enforced in Supabase. Users can only see their own receipts.
- **PII Scrubbing**: Before a receipt's data is used to "sharpen the model" (aggregate benchmarks), owner names and specific address lines are purged; only Zip Code and Clinic Name are retained for the geospatial index.
- **Read-Only Access**: Similar to your professional environment, internal "Vet Tech" validators have read-only access to the raw_json for auditing outliers without the ability to modify user profiles.

## 6. Infrastructure Diagram (Mental Model)

```
graph TD
    A[Mobile/Web UI] -->|Upload| B(Supabase Storage)
    B -->|Trigger| C[Edge Function]
    C -->|OCR| D(Google Document AI)
    D -->|Refine| E(Gemini 2.0 Flash)
    E -->|JSON| F{Postgres/PostGIS}
    F -->|Benchmarking| G[Verdict Engine]
    G -->|Result| A
```
