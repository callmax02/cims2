package com.example.backend.controller;

import com.example.backend.exception.DuplicateAssetTagException;
import com.example.backend.model.Item;
import com.example.backend.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173") // Allow only your React frontend
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        return itemService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@Valid @RequestBody Item item) {
        return ResponseEntity.ok(itemService.createItem(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody Item itemDetails) {
        try {
            Item updatedItem = itemService.updateItem(id, itemDetails);
            return ResponseEntity.ok(updatedItem);
        } catch (DuplicateAssetTagException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(Map.of("error", "The server encountered an error. Please try again later."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
