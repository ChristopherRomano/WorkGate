public abstract class Poster extends Employee {

    public Poster(String name, String email, String password) {
        super(email, password);
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