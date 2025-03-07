package com.example.backend.service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.exception.DuplicateAssetTagException;
import com.example.backend.exception.FailedToGenerateQRException;
import com.example.backend.exception.ItemNotFoundException;
import com.example.backend.model.Item;
import com.example.backend.repository.ItemRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class ItemServiceImpl implements ItemService{

    private ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        return item;
    }

    public Item createItem(Item item) {

        // Check for duplicate asset tags using findByAssetTag
        itemRepository.findByAssetTag(item.getAssetTag()).ifPresent(existingItem -> {
            throw new DuplicateAssetTagException(item.getAssetTag());
        });

        // Generate QR code using the assigned ID
        byte[] qrCode = generateQRCode(item.getAssetTag().toString());

        // Save the item with the generated QR code
        item.setQrCode(qrCode);
        return itemRepository.save(item);
    }


    public Item updateItem(Long id, Item itemDetails) {
        return itemRepository.findById(id).map(existingItem -> {
            // Check if the asset tag is changed
            if (!existingItem.getAssetTag().equals(itemDetails.getAssetTag())) {
                // Check if another record (not this one) already has the new assetTag
                Optional<Item> itemWithSameTag = itemRepository.findByAssetTag(itemDetails.getAssetTag());
                if (itemWithSameTag.isPresent() && !itemWithSameTag.get().getId().equals(id)) {
                    throw new DuplicateAssetTagException(itemDetails.getAssetTag());
                }
            }
    
            // Update fields
            existingItem.setAssigningDepartment(itemDetails.getAssigningDepartment());
            existingItem.setAssetTag(itemDetails.getAssetTag());
            existingItem.setSerial(itemDetails.getSerial());
            existingItem.setModel(itemDetails.getModel());
            existingItem.setStatus(itemDetails.getStatus());
            existingItem.setDefaultLocation(itemDetails.getDefaultLocation());
            existingItem.setImage(itemDetails.getImage());

            // Regenerate QR based on new asset tag
            byte[] qrCode = generateQRCode(existingItem.getAssetTag().toString());

            // Update the saved item with the generated QR code
            existingItem.setQrCode(qrCode);
    
            return itemRepository.save(existingItem);
        }).orElseThrow(() -> new ItemNotFoundException(id));
    }
    

    public void deleteItem(Long id) {
        if(!itemRepository.existsById(id)){
            throw new ItemNotFoundException(id);
        }
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
            // throw new RuntimeException("Failed to generate QR code", e);
            throw new FailedToGenerateQRException();
        }
    }
}
