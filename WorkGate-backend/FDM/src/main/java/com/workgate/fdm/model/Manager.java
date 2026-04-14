package com.workgate.fdm.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
public class Manager extends Poster {

	private String teamCode;

	public Manager(String email, String password) {
		super(email, password);
	}

    public Manager() {
        super();
    }



	public void assignTask(Employee emp, int tid, boolean completion, String desc, String title, PRIORITY priority, String dueDate, String category) {
		Task task = new Task(tid, completion, desc, title, priority, dueDate, category);
		emp.getTaskList().addTask(task);
	}

	public Employee searchEmployee(String name) {
		return Registry.getRegistry().findEmployeeByName(name);
	}

	public TaskList getEmployeeTasks(Employee e) {
		return e.getTaskList();
	}

	public void setTeamCode(String teamCode) {
		this.teamCode = teamCode;
	}

	public String getTeamCode() {
		return this.teamCode;
	}

	public float getPendingExpenseTotal() {
		// TODO - implement Manager.getPendingExpenseTotal
		throw new UnsupportedOperationException();
	}

}
