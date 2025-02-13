package com.example.backend.service;

import java.io.ByteArrayOutputStream;
// import java.nio.file.FileSystems;
// import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.exception.DuplicateAssetTagException;
import com.example.backend.model.Item;
import com.example.backend.repository.ItemRepository;
import com.google.zxing.BarcodeFormat;
// import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public Item createItem(Item item) {
        // Check for duplicate asset tags using findByAssetTag
        itemRepository.findByAssetTag(item.getAssetTag()).ifPresent(existingItem -> {
            throw new DuplicateAssetTagException("Asset Tag: '" + item.getAssetTag() + "' is already in use.");
        });

        // Save the item first to generate the ID
        Item savedItem = itemRepository.save(item);

        // Generate QR code using the assigned ID
        byte[] qrCode = generateQRCode(savedItem.getId().toString());

        // Update the saved item with the generated QR code
        savedItem.setQrCode(qrCode);
        return itemRepository.save(savedItem);
    }


    public Item updateItem(Long id, Item itemDetails) {
        return itemRepository.findById(id).map(existingItem -> {
            // Check if the asset tag is changed
            if (!existingItem.getAssetTag().equals(itemDetails.getAssetTag())) {
                // Check if another record (not this one) already has the new assetTag
                Optional<Item> itemWithSameTag = itemRepository.findByAssetTag(itemDetails.getAssetTag());
                if (itemWithSameTag.isPresent() && !itemWithSameTag.get().getId().equals(id)) {
                    throw new DuplicateAssetTagException("Asset Tag: '" + itemDetails.getAssetTag() + "' is already in use.");
                }
            }
    
            // Update fields
            existingItem.setDepartment(itemDetails.getDepartment());
            existingItem.setAssetTag(itemDetails.getAssetTag());
            existingItem.setSerial(itemDetails.getSerial());
            existingItem.setModel(itemDetails.getModel());
            existingItem.setStatus(itemDetails.getStatus());
            existingItem.setDefaultLocation(itemDetails.getDefaultLocation());
            existingItem.setImage(itemDetails.getImage());
    
            return itemRepository.save(existingItem);
        }).orElseThrow(() -> new RuntimeException("Item not found"));
    }
    

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    // QR Code Generation Method
    private byte[] generateQRCode(String text) {
        try {
            int width = 200;
            int height = 200;
            BitMatrix bitMatrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, width, height);
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", stream);
            return stream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }
}
