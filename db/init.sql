
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE users (
    
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,


    branch VARCHAR(50),
    year INT,

   
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);