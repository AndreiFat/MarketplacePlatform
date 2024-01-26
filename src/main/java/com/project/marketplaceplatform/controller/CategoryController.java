package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Category;
import com.project.marketplaceplatform.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:5173/")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @PostMapping("/addCategory")
    public Category createCategory(@RequestBody Category category) {
        categoryService.create(category);
        return category;
    }

    @GetMapping("/viewCategories")
    public List<?> getAllCategories() {
        return categoryService.getAll();
    }

    @GetMapping("/{categoryId}")
    public Optional<Category> getCategory(@PathVariable Long categoryId) {
        return categoryService.findById(categoryId);
    }

    @PutMapping("/editCategory/{categoryId}")
    public ResponseEntity<?> editCategory(@PathVariable Long categoryId, @RequestBody Category category) {
        return categoryService.update(categoryId, category);
    }

    @DeleteMapping("/deleteCategory/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteById(categoryId);
        return ResponseEntity.ok("The category was deleted!");
    }
}
