-- MTLverse Database Schema
-- PostgreSQL 14+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'MODERATOR');
CREATE TYPE manga_status AS ENUM ('ONGOING', 'COMPLETED', 'HIATUS', 'CANCELLED');
CREATE TYPE job_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');
CREATE TYPE region_type AS ENUM ('balloon', 'box', 'text', 'sound');

-- Providers (manga sources)
CREATE TABLE provider (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    base_url VARCHAR(500) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Manga/Webtoon metadata
CREATE TABLE manga (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_native VARCHAR(255),
    cover_url VARCHAR(500),
    synopsis TEXT,
    tags VARCHAR(50)[],
    status manga_status DEFAULT 'ONGOING',
    rating DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Manga provider mapping
CREATE TABLE manga_provider_map (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES provider(id) ON DELETE CASCADE,
    provider_manga_id VARCHAR(100) NOT NULL,
    provider_updated_at TIMESTAMP WITH TIME ZONE,
    etag VARCHAR(255),
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider_id, provider_manga_id)
);

-- Chapter information
CREATE TABLE chapter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    title VARCHAR(255),
    lang VARCHAR(10) DEFAULT 'en',
    page_count INTEGER DEFAULT 0,
    released_at TIMESTAMP WITH TIME ZONE,
    provider_chapter_id VARCHAR(100),
    provider_updated_at TIMESTAMP WITH TIME ZONE,
    status manga_status DEFAULT 'ONGOING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(manga_id, number)
);

-- Page images
CREATE TABLE page (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES chapter(id) ON DELETE CASCADE,
    index INTEGER NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    width INTEGER,
    height INTEGER,
    checksum VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chapter_id, index)
);

-- Text regions (balloons, boxes)
CREATE TABLE region (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES page(id) ON DELETE CASCADE,
    type region_type NOT NULL,
    polygon_json JSONB NOT NULL,
    bbox_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OCR text
CREATE TABLE ocr_span (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID NOT NULL REFERENCES region(id) ON DELETE CASCADE,
    source_lang VARCHAR(10) NOT NULL,
    text_raw TEXT NOT NULL,
    confidence DECIMAL(5,4),
    reading_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Translated text
CREATE TABLE mt_span (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ocr_span_id UUID NOT NULL REFERENCES ocr_span(id) ON DELETE CASCADE,
    target_lang VARCHAR(10) NOT NULL DEFAULT 'en',
    text_translated TEXT NOT NULL,
    engine VARCHAR(50),
    glossary_version VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Overlay data
CREATE TABLE overlay (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES page(id) ON DELETE CASCADE,
    overlay_json_url VARCHAR(500) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'USER',
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jobs (for future ML processing)
CREATE TABLE job (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    status job_status DEFAULT 'PENDING',
    payload_json JSONB NOT NULL,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE
);

-- User Interactions (simplified)
CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapter(id) ON DELETE CASCADE,
    page_index INTEGER NOT NULL DEFAULT 0,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, chapter_id)
);

CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, manga_id)
);

-- Indexes for performance
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_active ON user(is_active);

CREATE INDEX idx_manga_status ON manga(status);
CREATE INDEX idx_manga_tags ON manga USING GIN(tags);
CREATE INDEX idx_manga_rating ON manga(rating);
CREATE INDEX idx_manga_slug ON manga(slug);

CREATE INDEX idx_chapter_manga ON chapter(manga_id);
CREATE INDEX idx_chapter_number ON chapter(manga_id, number);
CREATE INDEX idx_chapter_published ON chapter(released_at);

CREATE INDEX idx_page_chapter ON page(chapter_id);
CREATE INDEX idx_page_index ON page(chapter_id, index);

CREATE INDEX idx_region_page ON region(page_id);
CREATE INDEX idx_ocr_span_region ON ocr_span(region_id);
CREATE INDEX idx_mt_span_ocr ON mt_span(ocr_span_id);

CREATE INDEX idx_overlay_page ON overlay(page_id);
CREATE INDEX idx_job_status ON job(status);
CREATE INDEX idx_job_type ON job(type);

CREATE INDEX idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_chapter ON reading_progress(chapter_id);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_manga ON favorites(manga_id);

-- Full-text search indexes
CREATE INDEX idx_manga_search ON manga USING GIN(to_tsvector('english', title_en || ' ' || COALESCE(synopsis, '')));
CREATE INDEX idx_chapter_search ON chapter USING GIN(to_tsvector('english', title));

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_manga_updated_at BEFORE UPDATE ON manga
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapter_updated_at BEFORE UPDATE ON chapter
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_updated_at BEFORE UPDATE ON job
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
