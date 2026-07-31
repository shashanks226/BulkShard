# BulkShard - Bulk Order Processing System

A scalable Node.js backend application for processing large CSV files containing order data. The system supports streaming CSV processing, batch database inserts, logical sharding, and Google Cloud Storage (GCS) integration to efficiently handle large datasets while maintaining data integrity.

## Storage Strategy: 
The application supports both **Google Cloud Storage (GCS)** and **Local Storage** for uploaded CSV files. The storage backend is configurable through environment variables. While Google Cloud Storage is the primary storage option for production and assessment, Local Storage is provided to simplify local development and testing without requiring cloud credentials.

- **Google Cloud Storage** is intended for production and assessment use.
- **Local Storage** is available for development and testing.
- The storage backend can be switched through environment configuration without changing the CSV processing logic.

## Features

- CSV file upload using Multer
- Stream-based CSV processing (Memory Efficient)
- Batch insertion into PostgreSQL
- Transaction support for reliable data insertion
- Logical sharding based on Customer ID
- Google Cloud Storage integration
- Local storage support (configurable)
- CSV data validation
- Structured logging
- Invalid record logging
- Centralized error handling
- RESTful API architecture

## Google ADC Configuration

This project uses Google Cloud Storage to store uploaded CSV files.

Authentication is configured using a Google Cloud service account.

### Steps

1. Create a service account in Google Cloud.
2. Download the service account JSON key.
3. Store the file locally (do not commit it to Git).
4. Set the following environment variable:

GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

The Google Cloud Storage client automatically uses these credentials through Google Application Default Credentials (ADC).

For local development, Local Storage can also be used by setting:

USE_GCS=false



## Sharding Strategy

The project implements logical sharding by generating a shard key from the customer ID.

Each customer is consistently assigned to the same logical shard using a deterministic hashing approach. This ensures that records belonging to the same customer are always mapped to the same shard while distributing data across logical partitions.

For this assessment, all records are stored in a single PostgreSQL database. The generated shard key is stored with each record to simulate logical sharding without requiring multiple database instances.

This approach demonstrates how records can be partitioned logically and can be extended to physical database sharding in a production environment if needed.




## Design Decisions and Trade-offs

### CSV Streaming

The application processes CSV files using streams instead of loading the entire file into memory. This allows large files to be processed efficiently.

### Batch Database Inserts

Records are inserted in batches instead of one at a time to reduce database calls and improve performance.

### Transaction Management

Each batch is inserted inside a database transaction. If a database error occurs during the batch, the transaction is rolled back to maintain data consistency.

### Layered Architecture

Controllers, services, repositories, validators, and utilities are separated to improve maintainability and scalability.

### Partial Processing

Validation errors do not stop the entire upload. Invalid records are logged while valid records continue to be processed. However, database errors are treated as critical and stop processing to preserve consistency.



## Screenshots
### Successful CSV Upload

Shows the API successfully processing a CSV file and returning the processing summary.

![Successful Upload](./screenshots/successful-upload.png)

### PostgreSQL Records

Demonstrates that valid records are inserted into PostgreSQL with logical shard information.

![PostgreSQL](./screenshots/postgres-orders.png)

### Google Cloud Storage

Shows the uploaded CSV file stored in the configured Google Cloud Storage bucket.

![GCS Bucket](./screenshots/gcs-bucket.png)

## Tech Stack

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- pg

### Cloud Storage
- Google Cloud Storage

### File Processing
- Multer
- csv-parser

### Other Libraries
- dotenv
- cors
- helmet
- morgan

# Architecture

                Client
                   │
          Upload CSV File
                   │
            Multer Middleware
                   │
          Local Upload / GCS Upload
                   │
        Stream CSV using csv-parser
                   │
          Validate Each Record
                   │
       Generate Logical Shard Key
                   │
             Create Batch
                   │
     PostgreSQL Bulk Insert (Transaction)
                   │
          Processing Statistics

# Database Schema
Main fields:
- order_id (Unique)
- customer_id
- order_date
- order_amount
- status
- shard_key
- created_at

The `shard_key` is generated from the customer ID using a deterministic hashing strategy to simulate logical sharding.


# CSV Processing Flow

1. Upload CSV
2. Save locally or upload to GCS
3. Read CSV as a stream
4. Validate every record
5. Generate shard key
6. Create batches of 1000 records
7. Insert batch inside a database transaction
8. Return processing statistics

# Error Handling
The application differentiates between validation errors and database errors.

### Validation Errors
- Missing fields
- Invalid dates
- Invalid order amount
- Invalid status

These records are skipped and logged.

### Database Errors
Examples:

- Duplicate Order ID
- Missing table
- Transaction failure
- Database connection issues

Database errors immediately stop processing and return an error response.

# Logging

The application maintains structured logs.

### Application Logs
logs/application.log

Contains:

- Server startup
- Batch insert information
- Processing events

### Failed Records
logs/failed-records.log


Contains:
- Row number
- CSV data
- Failure reason

# Environment Variables
Create a `.env` file.

NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/bulkshard
USE_GCS=true
GCS_BUCKET_NAME=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=credentials/service-account.json

# API Endpoints

## Health Check
GET /api/health

Response
```json
{
    "success": true,
    "message": "Server is healthy"
}
```

## Upload Orders
POST /api/upload-orders

### Request
Content-Type
multipart/form-data

Field
file

### Success Response
```json
{
    "success": true,
    "message": "Orders processed successfully",
    "data": {
        "totalRows": 10000,
        "successfulRows": 10000,
        "failedRows": 0
    }
}
```

# Sample CSV Format

```csv
order_id,customer_id,order_date,order_amount,status
ORD00001,CUST00001,2025-01-01,1500.50,Pending
ORD00002,CUST00002,2025-01-02,2499.99,Shipped
```

# Author

**Shashank Kumar**
Backend Developer | MERN Stack Developer