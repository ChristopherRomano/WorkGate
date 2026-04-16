package com.workgate.fdm.model;

import java.util.ArrayList;
import java.util.List;

public class PostList {

	private List<Post> posts;
	private static PostList instance;

	private PostList() {
		this.posts = new ArrayList<>();
	}

	public static PostList getInstance() {
		if (instance == null){
			instance = new PostList();
		}
		return instance;
	}

	public List<Post> filter(VISIBILITY area) {
		List<Post> filtedPosts = new ArrayList<>();

		for (int i = 0; i < this.posts.size(); i++){
			if (this.posts.get(i).getVisibility() == area){
				filtedPosts.add(this.posts.get(i));
			}
		}
		return filtedPosts;
	}

	public List<Post> getPostList() {
		return posts;
	}

	public void addPost(Post post) {
		this.posts.add(post);
	}

	public void deletePost(int id) {
		for (int i = 0; i < this.posts.size(); i++){
			if (this.posts.get(i).getId() == id){
				this.posts.remove(i);
			}
		}
	}

}