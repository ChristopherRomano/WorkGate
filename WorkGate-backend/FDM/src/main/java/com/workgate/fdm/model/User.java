package com.workgate.fdm.model;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
public abstract class User {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private String email;
	private String password;
	private String username;
	private String name;
	private String initials;
	private int failedAttempts;
	private boolean isLocked;
	private boolean active;

	public User(String email, String password) {
		this.email = email;
		this.password = password;
		this.failedAttempts = 0;
		this.isLocked = false;
		this.active = true;
	}

	public User(){}

	public boolean Login(String username, String password) {
		if (isLocked) return false;
		if (this.email.equals(username) && this.password.equals(password)) {
			this.failedAttempts = 0;
			return true;
		}
		this.failedAttempts++;
		if (this.failedAttempts >= 5) this.isLocked = true;
		return false;
	}

	public boolean checkPassword(String password) {
		return this.password.equals(password);
	}

	public void unlock() {
		this.isLocked = false;
		this.failedAttempts = 0;
	}

	public Long getId()       { return this.id; }
	public String getEmail()    { return this.email; }
	public String getUsername() { return this.username; }
	public String getName()     { return this.name; }
	public String getInitials() { return this.initials; }
	public boolean isLocked()   { return this.isLocked; }
	public boolean isActive()   { return this.active; }

	public void setUsername(String username) { this.username = username; }
	public void setName(String name)         { this.name = name; }
	public void setInitials(String initials) { this.initials = initials; }
	public void setActive(boolean active)    { this.active = active; }

}
