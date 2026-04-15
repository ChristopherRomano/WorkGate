package com.workgate.fdm;

import com.workgate.fdm.model.Employee;
import com.workgate.fdm.model.TAG;
import com.workgate.fdm.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FdmApplication {

	public static void main(String[] args) {
		SpringApplication.run(FdmApplication.class, args);
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
