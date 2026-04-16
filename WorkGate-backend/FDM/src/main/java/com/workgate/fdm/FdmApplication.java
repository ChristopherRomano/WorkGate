package com.workgate.fdm;

import com.workgate.fdm.model.Consultant;
import com.workgate.fdm.model.Employee;
import com.workgate.fdm.model.TAG;
import com.workgate.fdm.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class FdmApplication {

	public static void main(String[] args) {
		SpringApplication.run(FdmApplication.class, args);
	}

	@Bean
	CommandLineRunner migrateConsultantDtype(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.update(
					"UPDATE user SET dtype = 'CONSULTANT' " +
					"WHERE tag IN ('BENCH', 'DEPLOYED', 'TRAINEE') AND dtype = 'EMPLOYEE'"
				);
			} catch (Exception e) {
				System.err.println("Consultant dtype migration skipped: " + e.getMessage());
			}
		};
	}

	@Bean
	CommandLineRunner seedTestAdmin(EmployeeRepository employeeRepository) {
		return args -> {
			if (employeeRepository.findByEmail("admin@workgate.com") != null) return;
			Employee admin = new Employee("admin@workgate.com", "", "pass", TAG.ADMIN);
			admin.setName("Test");
			admin.setSurname("Admin");
			admin.setInitials("TA");
			admin.setUsername("admin");
			admin.setActive(true);
			employeeRepository.save(admin);
		};
	}

	@Bean
	CommandLineRunner seedTestManager(EmployeeRepository employeeRepository) {
		return args -> {
			if (employeeRepository.findByEmail("manager@workgate.com") != null) return;
			Employee manager = new Employee("manager@workgate.com", "", "pass", TAG.MANAGER);
			manager.setName("Test");
			manager.setSurname("Manager");
			manager.setInitials("TM");
			manager.setUsername("manager");
			manager.setActive(true);
			employeeRepository.save(manager);
		};
	}

	@Bean
	CommandLineRunner seedTestEmployee(EmployeeRepository employeeRepository) {
		return args -> {
			if (employeeRepository.findByEmail("employee@workgate.com") != null) return;
			Employee employee = new Employee("employee@workgate.com", "manager@workgate.com", "pass", TAG.EMPLOYEE);
			employee.setName("Test");
			employee.setSurname("Employee");
			employee.setInitials("TE");
			employee.setUsername("employee");
			employee.setActive(true);
			employeeRepository.save(employee);
		};
	}

	@Bean
	CommandLineRunner seedTestConsultant(EmployeeRepository employeeRepository) {
		return args -> {
			if (employeeRepository.findByEmail("consultant@workgate.com") != null) return;
			Consultant consultant = new Consultant("consultant@workgate.com", "manager@workgate.com", "pass", TAG.BENCH);
			consultant.setName("Test");
			consultant.setSurname("Consultant");
			consultant.setInitials("TC");
			consultant.setUsername("consultant");
			consultant.setActive(true);
			employeeRepository.save(consultant);
		};
	}

	@Bean
	CommandLineRunner seedTestHR(EmployeeRepository employeeRepository) {
		return args -> {
			if (employeeRepository.findByEmail("hr@workgate.com") != null) return;
			Employee hr = new Employee("hr@workgate.com", "", "pass", TAG.HR);
			hr.setName("Test");
			hr.setSurname("HR");
			hr.setInitials("TH");
			hr.setUsername("hr");
			hr.setActive(true);
			employeeRepository.save(hr);
		};
	}

	@Bean
	CommandLineRunner seedTestIT(EmployeeRepository employeeRepository) {
		return args -> {
			if (employeeRepository.findByEmail("ittech@workgate.com") != null) return;
			Employee it = new Employee("ittech@workgate.com", "", "pass", TAG.IT);
			it.setName("Test");
			it.setSurname("IT");
			it.setInitials("TI");
			it.setUsername("it");
			it.setActive(true);
			employeeRepository.save(it);
		};
	}

}