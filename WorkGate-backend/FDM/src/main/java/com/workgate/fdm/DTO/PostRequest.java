package com.workgate.fdm.DTO;

import com.workgate.fdm.model.VISIBILITY;

public class PostRequest {
    private String title;
    private String content;
    private boolean pinned;
    private VISIBILITY visibility;
    private String authorUsername;
    private long timePosted;

    public PostRequest() {}

    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getAuthorUsername() { return authorUsername; }
    public long getTimePosted() { return timePosted; }
    public VISIBILITY getVisibility() { return visibility; }
    public boolean getPinned() { return pinned; }

    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }
    public void setTimePosted(long timePosted) { this.timePosted = timePosted; }
    public void setVisibility(VISIBILITY visibility) { this.visibility = visibility; }
}
