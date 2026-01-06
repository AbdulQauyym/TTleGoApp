package com.ttelgo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class CreateOrderRequest {

    @NotBlank
    private String bundleName; // maps to eSIM Go "item"

    @Min(1)
    private int quantity = 1;

    private boolean assign = true;

    /**
     * Order type: "transaction" (default) or "validate" (no charge).
     */
    private String type = "transaction";

    public String getBundleName() {
        return bundleName;
    }

    public void setBundleName(String bundleName) {
        this.bundleName = bundleName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public boolean isAssign() {
        return assign;
    }

    public void setAssign(boolean assign) {
        this.assign = assign;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}












