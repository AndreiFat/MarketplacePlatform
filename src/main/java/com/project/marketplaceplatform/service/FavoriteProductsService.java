package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.repository.FavoriteProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FavoriteProductsService {
    @Autowired
    FavoriteProductsRepository favoriteProductsRepository;


}
