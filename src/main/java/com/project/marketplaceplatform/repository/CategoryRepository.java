package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
