package com.workgate.fdm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "posts")


public class Post {

	private String title;
	private String content;
	private boolean pinned;
	private VISIBILITY visibility;
	private String authorEmail;
	private long timePosted;
    @Id
    private Long id;

	/**
	 * 
	 * @param title
	 * @param content
	 * @param pinned
	 * @param visibility
	 * @param timePosted
	 * @param authorUsername
	 */

	public Post(String title, String content, boolean pinned, VISIBILITY visibility, long timePosted, String authorEmail) {
		this.title = title;
		this.content = content;
		this.pinned = pinned;
		this.visibility = visibility;
		this.timePosted = timePosted;
		this.authorEmail = authorEmail;
	}
	public Post() {}

	public String getTitle() {
		return this.title;
	}

	public boolean getPinned() {
		return this.pinned;
	}

	public VISIBILITY getVisibility() {
		return this.visibility;
	}

	public String getAuthorUsername() {
		return this.authorEmail;
	}
	public long getTimePosted() {
		return this.timePosted;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public Long getId() {
		return id;
	}
}
