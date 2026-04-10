package com.workgate.fdm.DTO;

import com.workgate.fdm.model.Poster;
import com.workgate.fdm.model.VISIBILITY;

public class PostRequest {
    private String title;
	private String content;
	private boolean pinned;
	private VISIBILITY visibility;
	private String author;
	private float timePosted;

    public PostRequest(){}

    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getAuthor() { return author; }
    public float getTimePosted() { return timePosted; }
    public VISIBILITY getVisibility() { return visibility; }
    public boolean getPinned(){ return pinned; }

    public void setAuthor(String author) { this.author = author; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }
    public void setTimePosted(float timePosted) { this.timePosted = timePosted; }
    public void setVisibility(VISIBILITY visibility) { this.visibility = visibility; }

}
