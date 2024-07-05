package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE c.id IN (SELECT DISTINCT p.categoryId.id FROM Product p)")
    List<Category> findCategoriesWithProducts();
}
