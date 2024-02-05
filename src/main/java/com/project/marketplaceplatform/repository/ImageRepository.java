package com.project.marketplaceplatform.repository;


import com.project.marketplaceplatform.model.Image;
import com.project.marketplaceplatform.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findByProduct(Product product);
}
