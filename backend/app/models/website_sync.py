from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ToggleSyncRequest(BaseModel):
    sync_enabled: bool = Field(..., description="Enable or disable auto synchronization for this website")

class BulkSyncResponse(BaseModel):
    checked: int = Field(..., description="Number of websites checked")
    updated: int = Field(..., description="Number of websites re-indexed due to content changes")
    unchanged: int = Field(..., description="Number of websites with no changes detected")
    failed: int = Field(..., description="Number of website sync check failures")
    duration: str = Field(..., description="Elapsed duration string, e.g. '12s'")

class CrawlHistoryResponse(BaseModel):
    id: str = Field(..., alias="_id", description="Crawl log unique ID")
    website_id: str = Field(..., description="Target website document ID")
    url: str = Field(..., description="Website page URL")
    started_at: datetime = Field(..., description="Crawl started timestamp")
    completed_at: datetime = Field(..., description="Crawl completed timestamp")
    duration_ms: int = Field(..., description="Crawl execution duration in milliseconds")
    status: str = Field(..., description="Crawl result status (success, failed)")
    content_changed: bool = Field(..., description="Whether content changes were detected")
    old_hash: str = Field(..., description="Previous content hash before crawl")
    new_hash: str = Field(..., description="Fresh content hash after crawl")
    old_chunks: int = Field(..., description="Previous vector count")
    new_chunks: int = Field(..., description="New vector count")
    message: str = Field(..., description="Crawl response or error details")
    raw_hash_changed: Optional[bool] = Field(False, description="Whether the raw SHA-256 hash changed")
    normalized_hash_changed: Optional[bool] = Field(False, description="Whether the normalized SHA-256 hash changed")
    reindex_triggered: Optional[bool] = Field(False, description="Whether full vector reindexing was run")
    reason: Optional[str] = Field("", description="Volatile content or change reason statement")

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CrawlHistoryListResponse(BaseModel):
    history: List[CrawlHistoryResponse]
    total: int

class WebsiteSyncStatsResponse(BaseModel):
    indexed_websites: int = Field(..., description="Total indexed websites")
    healthy_websites: int = Field(..., description="Healthy websites without errors")
    pending_updates: int = Field(..., description="Pending or newly added website sync counts")
    failed_websites: int = Field(..., description="Failed website counts")
    today_crawls: int = Field(..., description="Sync attempts performed today")
    today_updates: int = Field(..., description="Websites updated due to changes today")
    avg_crawl_time_ms: int = Field(..., description="Average crawl duration in ms")
    avg_chunk_count: int = Field(..., description="Average chunk count across all websites")

class WebsiteStatusItem(BaseModel):
    id: str = Field(..., alias="_id")
    url: str
    title: str
    domain: str
    word_count: int
    chunk_count: int
    indexed_at: datetime
    sync_status: str
    sync_enabled: bool
    last_checked: Optional[datetime] = None
    last_changed: Optional[datetime] = None
    last_error: Optional[str] = None
    check_count: int
    successful_checks: int
    failed_checks: int
    normalized_content_hash: Optional[str] = None

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SystemSyncStatusResponse(BaseModel):
    scheduler_running: bool = Field(..., description="Whether the background sync scheduler is active")
    interval_minutes: int = Field(..., description="Scheduler cycle check interval minutes")
    active_syncs_count: int = Field(..., description="Count of currently active crawls")
    websites_status: List[WebsiteStatusItem]
