package com.workgate.fdm.model;

public abstract class Poster extends Employee {

    public Poster(String email, String managerEmail, String password, TAG tag) {
        super(email, managerEmail, password, tag);
    }

	public Poster() {
		super();
	}

	/**
	 * 
	 * @param post
	 */
	public boolean deletePost(Post post, String email, String password) {

		// TODO - implement Poster.deletePost
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param title
	 * @param content
	 * @param pinned
	 * @param visability
	 * @param timePosted
	 */
	public boolean addPost(String title, String content, boolean pinned, VISIBILITY visability, int timePosted) {
		// TODO - implement Poster.addPost
		throw new UnsupportedOperationException();
	}

}