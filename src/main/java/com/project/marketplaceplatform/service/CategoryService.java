package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Category;
import com.project.marketplaceplatform.repository.CategoryRepository;
import org.hibernate.sql.ast.tree.cte.CteColumn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    public void create(Category category){
        categoryRepository.save(category);
    }

    public List<Category> getAll(){
        return categoryRepository.findAll();
    }

    public Optional<Category> findById(Long categoryId){
        return categoryRepository.findById(categoryId);
    }

    public ResponseEntity<?> update(Long categoryId, Category category){
        categoryRepository.findById(categoryId).ifPresent(foundCategory ->{
            foundCategory.setName(category.getName());
            categoryRepository.save(foundCategory);
        });
        return ResponseEntity.ok("Category Edited!");
    }

    public void deleteById(Long categoryId){
        categoryRepository.deleteById(categoryId);
    }
}
