package com.workgate.fdm.model;

public class Post {

	private String title;
	private String content;
	private boolean pinned;
	private VISIBILITY visibility;
	private Poster author;
	private int timePosted;

	/**
	 * 
	 * @param title
	 * @param content
	 * @param pinned
	 * @param visibility
	 * @param timePosted
	 * @param parameter
	 * @param author
	 */
	public Post(String title, String content, boolean pinned, VISIBILITY visibility, int timePosted, String parameter, Poster author) {
		// TODO - implement Post.Post
		throw new UnsupportedOperationException();
	}

	public String getTitle() {
		return this.title;
	}

	public boolean getPinned() {
		return this.pinned;
	}

	public VISIBILITY getVisibility() {
		return this.visibility;
	}

	public Poster getAuthor() {
		return this.author;
	}

	public int getTimePosted() {
		return this.timePosted;
	}

}