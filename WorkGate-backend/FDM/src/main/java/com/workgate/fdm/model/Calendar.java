package com.workgate.fdm.model;

import java.util.List;


public class Calendar {

	private List<Day> days;
	private static Calendar instance;

	public List<Day> getDays() {
		return days;
	}



	/**
	 * 
	 * @param employee
	 * @param startDate
	 * @param endDate
	 */
	public boolean removeDaysForRange(Employee employee, int startDate, int endDate) {
		// TODO - implement Calendar.removeDaysForRange
		throw new UnsupportedOperationException();
	}

	public static Calendar getInstance() {
		return instance;
	}

	private Calendar() {
		// TODO - implement Calendar.Calendar
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param startDate
	 * @param endDate
	 */
	public List<Day> getDaysForRange(int startDate, int endDate) {
		// TODO - implement Calendar.getDaysForRange
		throw new UnsupportedOperationException();
	}

	/**
	 * 
	 * @param employee
	 * @param startDate
	 * @param endDate
	 */
	public void createDaysForRange(Employee employee, int startDate, int endDate) {
		// TODO - implement Calendar.createDaysForRange
		throw new UnsupportedOperationException();
	}

}