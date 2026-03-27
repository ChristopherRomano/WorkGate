package com.workgate.fdm;

public abstract class User {

	private String email;
	private String password;
	private int failedAttempts;
	private boolean isLocked;
	private String language;

	/**
	 * 
	 * @param email
	 * @param password
	 */
	public User(String email, String password) {
		// TODO - implement User.User
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param Username
	 * @param Password
	 */
	public boolean Login(String Username, String Password) {
		// TODO - implement User.Login
		throw new UnsupportedOperationException();
	}

	public void requestPasswordReset() {
		// TODO - implement User.requestPasswordReset
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param language
	 */
	public void changeLanguage(String language) {
		// TODO - implement User.changeLanguage
		throw new UnsupportedOperationException();
	}

	public void unlock() {
		// TODO - implement User.unlock
		throw new UnsupportedOperationException();
	}

}