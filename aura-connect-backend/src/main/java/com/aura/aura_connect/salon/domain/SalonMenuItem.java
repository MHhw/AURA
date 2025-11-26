package com.aura.aura_connect.salon.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "salon_menu_items")
public class SalonMenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SalonMenuKey menuKey;

    @Column(nullable = false, length = 80)
    private String label;

    @Column(nullable = false, length = 120)
    private String path;

    @Column(nullable = false)
    private boolean visible = true;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salon_id")
    private Salon salon;

    protected SalonMenuItem() {
        // for JPA
    }

    public SalonMenuItem(SalonMenuKey menuKey, String label, String path, int displayOrder) {
        this.menuKey = menuKey;
        this.label = label;
        this.path = path;
        this.displayOrder = displayOrder;
        this.visible = true;
    }

    public void assignSalon(Salon salon) {
        this.salon = salon;
    }

    public Long getId() {
        return id;
    }

    public SalonMenuKey getMenuKey() {
        return menuKey;
    }

    public String getLabel() {
        return label;
    }

    public String getPath() {
        return path;
    }

    public boolean isVisible() {
        return visible;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public Salon getSalon() {
        return salon;
    }

    public void updateLabel(String label) {
        this.label = label;
    }

    public void updatePath(String path) {
        this.path = path;
    }

    public void toggleVisibility(boolean visible) {
        this.visible = visible;
    }

    public void updateDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }
}
