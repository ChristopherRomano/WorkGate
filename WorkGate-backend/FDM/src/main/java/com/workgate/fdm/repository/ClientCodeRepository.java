package com.workgate.fdm.repository;

import com.workgate.fdm.model.ClientCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientCodeRepository extends JpaRepository<ClientCode, String> {
    ClientCode findByCode(String code);
}
