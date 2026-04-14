package com.workgate.fdm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "posts")


public class Post {

	private String title;
	private String content;
	private boolean pinned;
	private VISIBILITY visibility;
	private String authorUsername;
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

	public Post(String title, String content, boolean pinned, VISIBILITY visibility, long timePosted, String authorUsername) {
		// TODO - implement Post.Post
		throw new UnsupportedOperationException();
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
		return this.authorUsername;
	}
	public long getTimePosted() {
		return this.timePosted;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}
}