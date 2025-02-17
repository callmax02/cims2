package com.example.backend.service;

import java.util.List;
import com.example.backend.model.Item;

public interface ItemService {

    public List<Item> getAllItems();
    public Item getItemById(Long id);
    public Item createItem(Item item);
    public Item updateItem(Long id, Item item);
    public void deleteItem(Long id);
}
