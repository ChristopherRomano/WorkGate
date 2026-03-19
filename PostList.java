import java.util.List;

public class PostList {

	private List<Post> posts;
	private static PostList instance;

	private PostList() {
		// TODO - implement PostList.PostList
		throw new UnsupportedOperationException();
	}

	public static PostList getInstance() {
		return instance;
	}

	/**
	 * 
	 * @param area
	 */
	public List<Post> filter(VISIBILITY area) {
		// TODO - implement PostList.filter
		throw new UnsupportedOperationException();
	}

	public List<Post> getPostList() {
		// TODO - implement PostList.getPostList
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param post
	 */
	public boolean addPost(Post post) {
		// TODO - implement PostList.addPost
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param post
	 */
	public boolean deletePost(Post post) {
		// TODO - implement PostList.deletePost
		throw new UnsupportedOperationException();
	}

}