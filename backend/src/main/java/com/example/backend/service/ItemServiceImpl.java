package com.example.backend.service;

import java.io.ByteArrayOutputStream;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
public class ItemServiceImpl implements ItemService {

    private ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException(id));
        return item;
    }

    @Transactional
    public Item createItem(Item item) {
        // Save item to generate ID (part of the transaction)
        Item savedItem = itemRepository.save(item);

        // Generate YYMM from current date
        YearMonth currentYearMonth = YearMonth.now(ZoneId.of("UTC"));
        String yyMM = String.format("%02d%02d",
                currentYearMonth.getYear() % 100,
                currentYearMonth.getMonthValue());

        // Generate assetTag
        String assetTag = generateAssetTag(savedItem, yyMM);

        // Check for duplicates
        if (itemRepository.findByAssetTag(assetTag).isPresent()) {
            throw new DuplicateAssetTagException(assetTag); // Triggers rollback
        }

        // Update managed entity
        savedItem.setAssetTag(assetTag);
        savedItem.setQrCode(generateQRCode(assetTag));

        return savedItem;
    }


    @Transactional
    public Item updateItem(Long id, Item itemDetails) {
        return itemRepository.findById(id).map(existingItem -> {
            // Extract YYMM from existing assetTag
            String existingAssetTag = existingItem.getAssetTag();
            if (existingAssetTag == null || existingAssetTag.split("-").length < 5) {
                throw new IllegalArgumentException("Invalid assetTag format");
            }
            String yyMM = existingAssetTag.split("-")[2];

            // Update fields that affect the assetTag
            existingItem.setAssigningDepartment(itemDetails.getAssigningDepartment());
            existingItem.setType(itemDetails.getType());
            existingItem.setSubType(itemDetails.getSubType());

            // Generate new assetTag using existing YYMM
            String newAssetTag = generateAssetTag(existingItem, yyMM);

            // Check for duplicates (excluding current item)
            Optional<Item> duplicateItem = itemRepository.findByAssetTag(newAssetTag);
            if (duplicateItem.isPresent() && !duplicateItem.get().getId().equals(id)) {
                throw new DuplicateAssetTagException(newAssetTag); // Triggers rollback
            }

            // Update assetTag and QR code
            existingItem.setAssetTag(newAssetTag);
            existingItem.setQrCode(generateQRCode(newAssetTag));

            return existingItem;
        }).orElseThrow(() -> new ItemNotFoundException(id));
    }
    

    public void deleteItem(Long id) {
        if(!itemRepository.existsById(id)){
            throw new ItemNotFoundException(id);
        }
        itemRepository.deleteById(id);
    }

    // Helper method to generate assetTag
    private String generateAssetTag(Item item, String yyMM) {
        String assigningDeptCode = item.getAssigningDepartment().getCode();
        String typeCode = item.getType().getCode();
        String subTypeUpper = item.getSubType().toUpperCase();
        String paddedId = String.format("%04d", item.getId());
        return String.format("CMX-%s-%s-%s-%s-%s",
                assigningDeptCode, yyMM, typeCode, subTypeUpper, paddedId);
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
