package com.workgate.fdm.repository;

import com.workgate.fdm.model.AnnualLeaveRequest;
import com.workgate.fdm.model.ItTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItTicketRequestRepository extends JpaRepository<ItTicket, Long> {
    List<ItTicket> findByEmployeeEmail(String employeeEmail);
}