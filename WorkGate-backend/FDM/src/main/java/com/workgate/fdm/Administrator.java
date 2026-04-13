package com.workgate.fdm;

public class Administrator extends User {

	public Administrator(String email, String password) {
		super(email, password);
	}

	public boolean createEmployee(String email, String password, String type) {
		Employee emp;
		switch (type.toLowerCase()) {
			case "consultant":   emp = new Consultant(email, password);   break;
			case "manager":      emp = new Manager(email, password);      break;
			case "hr":           emp = new HrRep(email, password);        break;
			case "ittech":       emp = new ItTechnician(email, password); break;
			default:             emp = new Employee(email, password);     break;
		}
		Registry.getRegistry().addUser(emp);
		return true;
	}

	public boolean createAdmin(String email, String password) {
		Registry.getRegistry().addUser(new Administrator(email, password));
		return true;
	}

	public void removeEmployee(Employee employee) {
		Registry.getRegistry().getUserList().remove(employee);
	}

	public boolean updateTag(Employee employee, TAG newTag) {
		employee.setTag(newTag);
		return true;
	}

	public boolean addCllientCode(String clientCode) {
		Registry.getRegistry().addClientCode(clientCode);
		return true;
	}

	public boolean removeClientCode(String clientCode) {
		return Registry.getRegistry().removeClientCode(clientCode);
	}

	public boolean assignManger(Employee employee, Manager manager) {
		employee.setManager(manager);
		return true;
	}

}
