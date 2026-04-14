package com.workgate.fdm.model;

import java.util.ArrayList;
import java.util.List;


public class Day {

	private List<Employee> EmployeesOut;
	private int Date;

	public Day(int date, Employee employee) {
		this.EmployeesOut = new ArrayList<>();
		this.EmployeesOut.add(employee);
		this.Date = date;
	}

	public void addAbsence(Employee employee) {
		this.EmployeesOut.add(employee);
	}

	public int getDate() {
		return Date;
	}

	public List<Employee> getEmployees() {
		return EmployeesOut;
	}

	public void removeEmployee(Employee employee) {
		this.EmployeesOut.remove(employee);
	}

}