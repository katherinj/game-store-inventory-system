package com.katherinj.gamestore.service;

import com.katherinj.gamestore.dto.InvoiceItemRequestDTO;
import com.katherinj.gamestore.dto.InvoiceRequestDTO;
import com.katherinj.gamestore.exception.InsufficientInventoryException;
import com.katherinj.gamestore.exception.NotFoundException;
import com.katherinj.gamestore.model.*;
import com.katherinj.gamestore.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

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
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoice(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Invoice not found with id: " + id));
    }

    public List<Invoice> searchInvoices(String name, String state) {
        if (name != null && !name.isBlank()) {
            return invoiceRepository.findByNameContainingIgnoreCase(name.trim());
        }
        if (state != null && !state.isBlank()) {
            return invoiceRepository.findByStateIgnoreCase(state.trim());
        }
        return invoiceRepository.findAll();
    }
    @Transactional
    public Invoice createInvoice(InvoiceRequestDTO req) {
        Tax tax = taxRepository.findById(req.getState().toUpperCase())
                .orElseThrow(() -> new NotFoundException("Invalid state: " + req.getState()));

        Invoice invoice = Invoice.builder()
                .name(req.getName())
                .street(req.getStreet())
                .city(req.getCity())
                .state(req.getState().toUpperCase())
                .zipcode(req.getZipcode())
                .subtotal(BigDecimal.ZERO)
                .tax(BigDecimal.ZERO)
                .processingFee(BigDecimal.ZERO)
                .total(BigDecimal.ZERO)
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal processingFeeTotal = BigDecimal.ZERO;

        for (InvoiceItemRequestDTO itemReq : req.getItems()) {
            String type = itemReq.getItemType();
            Long itemId = itemReq.getItemId();
            int qty = itemReq.getQuantity();

            BigDecimal unitPrice = resolveUnitPriceAndDecrementInventory(type, itemId, qty);

            BigDecimal lineTotal = unitPrice.multiply(new BigDecimal(qty));
            subtotal = subtotal.add(lineTotal);

            // fee per line item type
            Fee fee = feeRepository.findById(type)
                    .orElseThrow(() -> new NotFoundException("No fee configured for itemType: " + type));

            BigDecimal lineFee = fee.getFee();
            if (qty > 10) lineFee = lineFee.add(EXTRA_BULK_FEE);
            processingFeeTotal = processingFeeTotal.add(lineFee);

            InvoiceItem invItem = InvoiceItem.builder()
                    .invoice(invoice)
                    .itemType(type)
                    .itemId(itemId)
                    .quantity(qty)
                    .unitPrice(money(unitPrice))
                    .lineTotal(money(lineTotal))
                    .build();

            invoice.getItems().add(invItem);
        }

        BigDecimal taxAmount = subtotal.multiply(tax.getRate());
        BigDecimal total = subtotal.add(taxAmount).add(processingFeeTotal);

        if (total.compareTo(new BigDecimal("999.99")) > 0) {
            throw new IllegalArgumentException("Total must be less than $1,000");
        }

        invoice.setSubtotal(money(subtotal));
        invoice.setTax(money(taxAmount));
        invoice.setProcessingFee(money(processingFeeTotal));
        invoice.setTotal(money(total));

        return invoiceRepository.save(invoice); // cascades items
    }

    private BigDecimal resolveUnitPriceAndDecrementInventory(String itemType, Long itemId, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be at least 1");

        return switch (itemType) {
            case "Game" -> {
                Game g = gameRepository.findById(itemId)
                        .orElseThrow(() -> new NotFoundException("Game not found with id: " + itemId));
                if (g.getQuantity() < quantity) {
                    throw new InsufficientInventoryException(
                            "Not enough Game inventory. Available: " + g.getQuantity() + ", requested: " + quantity
                    );
                }
                g.setQuantity(g.getQuantity() - quantity);
                gameRepository.save(g);
                yield g.getPrice();
            }
            case "T-Shirt" -> {
                TShirt t = tShirtRepository.findById(itemId)
                        .orElseThrow(() -> new NotFoundException("T-Shirt not found with id: " + itemId));
                if (t.getQuantity() < quantity) {
                    throw new InsufficientInventoryException(
                            "Not enough T-Shirt inventory. Available: " + t.getQuantity() + ", requested: " + quantity
                    );
                }
                t.setQuantity(t.getQuantity() - quantity);
                tShirtRepository.save(t);
                yield t.getPrice();
            }
            case "Console" -> {
                Console c = consoleRepository.findById(itemId)
                        .orElseThrow(() -> new NotFoundException("Console not found with id: " + itemId));
                if (c.getQuantity() < quantity) {
                    throw new InsufficientInventoryException(
                            "Not enough Console inventory. Available: " + c.getQuantity() + ", requested: " + quantity
                    );
                }
                c.setQuantity(c.getQuantity() - quantity);
                consoleRepository.save(c);
                yield c.getPrice();
            }
            default -> throw new IllegalArgumentException("Invalid itemType. Use: Game, Console, T-Shirt");
        };
    }

    private static BigDecimal money(BigDecimal x) {
        return x.setScale(2, RoundingMode.HALF_UP);
    }
}