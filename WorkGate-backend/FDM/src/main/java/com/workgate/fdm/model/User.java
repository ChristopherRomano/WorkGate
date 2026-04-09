package com.workgate.fdm.model;

public abstract class User {

	private String email;
	private String password;
	private int failedAttempts;
	private boolean isLocked;

	/**
	 * 
	 * @param email
	 * @param password
	 */
	public User(String email, String password) {
		this.email = email;
		this.password = password;
		this.failedAttempts = 0;
		this.isLocked = false;
	}

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public int getFailedAttempts() {
		return failedAttempts;
	}

	public boolean isLocked() {
		return isLocked;
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