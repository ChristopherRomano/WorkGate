package com.workgate.fdm;

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
	CommandLineRunner seedTestManager(EmployeeRepository employeeRepository) {
		return args -> {
			if (employeeRepository.findByEmail("manager@workgate.com") != null) {
				return;
			}

			Employee manager = new Employee("manager@workgate.com", "", "pass", TAG.MANAGER);
			manager.setName("Test");
			manager.setSurname("Manager");
			manager.setInitials("TM");
			manager.setUsername("manager");
			manager.setActive(true);

			employeeRepository.save(manager);
		};
	}
}
