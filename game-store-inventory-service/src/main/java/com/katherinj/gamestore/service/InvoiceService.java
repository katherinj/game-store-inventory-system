package com.katherinj.gamestore.service;

import com.katherinj.gamestore.dto.InvoiceRequestDTO;
import com.katherinj.gamestore.exception.NotFoundException;
import com.katherinj.gamestore.model.*;
import com.katherinj.gamestore.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class InvoiceService {

    private final TaxRepository taxRepository;
    private final FeeRepository feeRepository;
    private final GameRepository gameRepository;
    private final TShirtRepository tShirtRepository;
    private final ConsoleRepository consoleRepository;
    private final InvoiceRepository invoiceRepository;

    private static final BigDecimal EXTRA_BULK_FEE = new BigDecimal("15.49");

    public InvoiceService(
            TaxRepository taxRepository,
            FeeRepository feeRepository,
            GameRepository gameRepository,
            TShirtRepository tShirtRepository,
            ConsoleRepository consoleRepository,
            InvoiceRepository invoiceRepository
    ) {
        this.taxRepository = taxRepository;
        this.feeRepository = feeRepository;
        this.gameRepository = gameRepository;
        this.tShirtRepository = tShirtRepository;
        this.consoleRepository = consoleRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional
    public Invoice createInvoice(InvoiceRequestDTO req) {

        // 1) Validate state tax exists
        Tax tax = taxRepository.findById(req.getState().toUpperCase())
                .orElseThrow(() -> new NotFoundException("Invalid state: " + req.getState()));

        // 2) Fee lookup by product type
        Fee fee = feeRepository.findById(req.getItemType())
                .orElseThrow(() -> new NotFoundException("No fee configured for itemType: " + req.getItemType()));

        // 3) Lookup item + unit price + update inventory
        ItemPricingAndInventory info = resolveItemAndDecrementInventory(
                req.getItemType(), req.getItemId(), req.getQuantity()
        );

        // 4) Calculate totals
        BigDecimal qty = new BigDecimal(req.getQuantity());

        BigDecimal subtotal = info.unitPrice.multiply(qty);
        BigDecimal taxAmount = subtotal.multiply(tax.getRate());

        BigDecimal processingFee = fee.getFee();
        if (req.getQuantity() > 10) processingFee = processingFee.add(EXTRA_BULK_FEE);

        BigDecimal total = subtotal.add(taxAmount).add(processingFee);

        // Optional cap like your old code
        if (total.compareTo(new BigDecimal("999.99")) > 0) {
            throw new IllegalArgumentException("Total must be less than $1,000");
        }

        // Standardize rounding
        subtotal = money(subtotal);
        taxAmount = money(taxAmount);
        processingFee = money(processingFee);
        total = money(total);

        // 5) Save invoice
        Invoice invoice = Invoice.builder()
                .name(req.getName())
                .street(req.getStreet())
                .city(req.getCity())
                .state(req.getState().toUpperCase())
                .zipcode(req.getZipcode())
                .itemType(req.getItemType())
                .itemId(req.getItemId())
                .unitPrice(money(info.unitPrice))
                .quantity(req.getQuantity())
                .subtotal(subtotal)
                .tax(taxAmount)
                .processingFee(processingFee)
                .total(total)
                .build();

        return invoiceRepository.save(invoice);
    }

    // ---- helpers ----

    private static BigDecimal money(BigDecimal x) {
        return x.setScale(2, RoundingMode.HALF_UP);
    }

    private record ItemPricingAndInventory(BigDecimal unitPrice) {}

    private ItemPricingAndInventory resolveItemAndDecrementInventory(String itemType, Long itemId, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be at least 1");

        return switch (itemType) {
            case "Game" -> {
                Game g = gameRepository.findById(itemId)
                        .orElseThrow(() -> new NotFoundException("Game not found with id: " + itemId));
                if (g.getQuantity() < quantity) throw new IllegalArgumentException("Not enough Game inventory");
                g.setQuantity(g.getQuantity() - quantity);
                gameRepository.save(g);
                yield new ItemPricingAndInventory(g.getPrice());
            }
            case "T-Shirt" -> {
                TShirt t = tShirtRepository.findById(itemId)
                        .orElseThrow(() -> new NotFoundException("T-Shirt not found with id: " + itemId));
                if (t.getQuantity() < quantity) throw new IllegalArgumentException("Not enough T-Shirt inventory");
                t.setQuantity(t.getQuantity() - quantity);
                tShirtRepository.save(t);
                yield new ItemPricingAndInventory(t.getPrice());
            }
            case "Console" -> {
                Console c = consoleRepository.findById(itemId)
                        .orElseThrow(() -> new NotFoundException("Console not found with id: " + itemId));
                if (c.getQuantity() < quantity) throw new IllegalArgumentException("Not enough Console inventory");
                c.setQuantity(c.getQuantity() - quantity);
                consoleRepository.save(c);
                yield new ItemPricingAndInventory(c.getPrice());
            }
            default -> throw new IllegalArgumentException("Invalid itemType. Use: Game, Console, T-Shirt");
        };
    }
}