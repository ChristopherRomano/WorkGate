package com.workgate.fdm.DTO;

import com.workgate.fdm.model.Poster;
import com.workgate.fdm.model.VISIBILITY;

public class PostRequest {
    private String title;
	private String content;
	private boolean pinned;
	private VISIBILITY visibility;
	private Poster author;
	private int timePosted;

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Poster getAuthor() {
        return author;
    }

    public int getTimePosted() {
        return timePosted;
    }

    public VISIBILITY getVisibility() {
        return visibility;
    }
    
    public boolean getPinned(){
        return pinned;
    }
}
