package com.workgate.fdm.model;

public class Post {

	private String title;
	private String content;
	private boolean pinned;
	private VISIBILITY visibility;
	private String authorUsername;
	private int timePosted;
	private int id;
	private static int nextId = 0;

	public Post(String title, String content, boolean pinned, VISIBILITY visibility, int timePosted, String author) {
		this.title = title;
		this.content = content;
		this.pinned = pinned;
		this.visibility = visibility;
		this.timePosted = timePosted;
		this.authorUsername = author;
		this.id = nextId++;
	}

	public String getTitle() { return this.title; }
	public boolean getPinned() { return this.pinned; }
	public VISIBILITY getVisibility() { return this.visibility; }
	public String getAuthor() { return this.authorUsername; }
	public int getTimePosted() { return this.timePosted; }
	public String getAuthorUsername() {	return authorUsername; }
	public String getContent() { return content; }
	public int getId() { return id; }
}
