package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.id = :userId")
    User findByUserId(@Param("userId") Long userId);

    @Query("SELECT u FROM User u WHERE u.id = :userId and u.role='ROLE_SELLER'")
    User findBySellerId(@Param("userId") Long userId);

    Optional<User> findByEmail(String email);

    long countByEmail(String email);
}
